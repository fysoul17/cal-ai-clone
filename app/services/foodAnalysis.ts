import { NutritionAnalysis, MealType } from '@/app/types/meal';

// T010: Supported image formats
const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

/** Error thrown by food analysis operations */
export interface FoodAnalysisError {
  message: string;
  retryable: boolean;
}

/**
 * Validates that a file is a supported image format
 * @param file - The file to validate
 * @returns true if the file type is supported (JPEG, PNG, WebP, HEIC)
 */
export function isValidImageFormat(file: File): boolean {
  return SUPPORTED_FORMATS.includes(file.type.toLowerCase());
}

// T010a: Check if file is HEIC format
function isHeicFormat(file: File): boolean {
  const type = file.type.toLowerCase();
  return type === 'image/heic' || type === 'image/heif';
}

// T010a: Convert HEIC to JPEG using Canvas (fallback method)
// Note: Native HEIC support varies by browser. This provides basic support.
async function convertHeicToJpeg(file: File): Promise<Blob> {
  // Try to load the image - modern browsers may support HEIC
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.drawImage(bitmap, 0, 0);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert HEIC image'));
        },
        'image/jpeg',
        0.85
      );
    });
  } catch {
    throw new Error('HEIC images are not supported by your browser. Please convert to JPEG or PNG.');
  }
}

/**
 * Resizes an image to fit within maximum dimensions while preserving aspect ratio
 * @param file - The image file to resize
 * @param maxDimension - Maximum dimension for longest edge (default: 1280px)
 * @returns Resized image as JPEG blob at 85% quality
 */
export async function resizeImage(file: File, maxDimension = 1280): Promise<Blob> {
  // Handle HEIC conversion first if needed
  let imageSource: Blob = file;
  if (isHeicFormat(file)) {
    imageSource = await convertHeicToJpeg(file);
  }

  const img = await createImageBitmap(imageSource);

  // Calculate scale to fit within maxDimension
  const scale = Math.min(maxDimension / img.width, maxDimension / img.height, 1);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Use high-quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to resize image'));
      },
      'image/jpeg',
      0.85
    );
  });
}

/**
 * Parses webhook response, handling both direct format and Gemini API nested format
 */
function parseWebhookResponse(data: unknown): NutritionAnalysis {
  let nutritionData: Record<string, unknown>;

  // Check if this is a Gemini API response (array with candidates)
  if (
    Array.isArray(data) &&
    (data as Array<{ candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }>)[0]?.candidates?.[0]?.content?.parts?.[0]?.text
  ) {
    const textContent = (data as Array<{ candidates: Array<{ content: { parts: Array<{ text: string }> } }> }>)[0].candidates[0].content.parts[0].text;
    try {
      nutritionData = JSON.parse(textContent);
    } catch {
      throw {
        message: 'Failed to parse AI response. Please try again.',
        retryable: true,
      } as FoodAnalysisError;
    }
  } else if (
    (data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> })?.candidates?.[0]?.content?.parts?.[0]?.text
  ) {
    // Single object Gemini response (not in array)
    const textContent = (data as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> }).candidates[0].content.parts[0].text;
    try {
      nutritionData = JSON.parse(textContent);
    } catch {
      throw {
        message: 'Failed to parse AI response. Please try again.',
        retryable: true,
      } as FoodAnalysisError;
    }
  } else {
    // Direct format - assume it's already the nutrition data
    nutritionData = data as Record<string, unknown>;
  }

  // Defensive parsing - handle missing fields gracefully
  return {
    food_name: (nutritionData.food_name as string) || 'Unknown food item',
    calories: typeof nutritionData.calories === 'number' ? nutritionData.calories : 0,
    protein: typeof nutritionData.protein === 'number' ? nutritionData.protein : 0,
    carbs: typeof nutritionData.carbs === 'number' ? nutritionData.carbs : 0,
    fat: typeof nutritionData.fat === 'number' ? nutritionData.fat : 0,
  };
}

// T008: Retry helper with exponential backoff (1s, 2s, 4s delays)
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> {
  const delays = [1000, 2000, 4000]; // Exponential backoff
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        if (onRetry) onRetry(attempt + 1, lastError);
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  }

  throw lastError;
}

/** Options for food analysis */
export interface AnalyzeFoodOptions {
  image: Blob;
  userId: string;
  mealType?: MealType;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Analyzes a food image using the AI webhook
 * @param options - Analysis options including image, userId, and optional mealType
 * @returns Nutrition analysis results from the AI
 * @throws FoodAnalysisError on failure
 */
export async function analyzeFood(
  options: AnalyzeFoodOptions
): Promise<NutritionAnalysis> {
  const { image, userId, mealType, onRetry } = options;
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;

  if (!webhookUrl) {
    throw {
      message: 'Webhook URL not configured. Please check environment settings.',
      retryable: false,
    } as FoodAnalysisError;
  }

  if (!userId) {
    throw {
      message: 'User not authenticated. Please log in.',
      retryable: false,
    } as FoodAnalysisError;
  }

  return withRetry(
    async () => {
      const formData = new FormData();
      formData.append('image', image, 'food.jpg');
      formData.append('user_id', userId);
      if (mealType) {
        formData.append('meal_type', mealType);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error: FoodAnalysisError = {
            message: response.status === 400
              ? 'Invalid image. Please try a different photo.'
              : `Analysis failed (${response.status}). Please try again.`,
            retryable: response.status >= 500,
          };
          throw error;
        }

        const data = await response.json();
        return parseWebhookResponse(data);
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
          throw {
            message: 'Analysis timed out. Please try again.',
            retryable: true,
          } as FoodAnalysisError;
        }

        // Re-throw FoodAnalysisError as-is
        if ((error as FoodAnalysisError).retryable !== undefined) {
          throw error;
        }

        throw {
          message: 'Network error. Please check your connection.',
          retryable: true,
        } as FoodAnalysisError;
      }
    },
    3,
    onRetry
  );
}
