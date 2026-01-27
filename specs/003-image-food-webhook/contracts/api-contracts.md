# API Contracts: Image-Based Food Input with AI Analysis

**Feature**: 003-image-food-webhook
**Date**: 2026-01-27

## Overview

This feature integrates with an external n8n webhook for AI-powered food image analysis. This document defines the request/response contracts for the webhook integration.

---

## Webhook Endpoint

### Configuration

| Environment | URL |
|-------------|-----|
| Test | `https://primary-production-08595.up.railway.app/webhook-test/51ad3e9f-997e-490b-a495-7cd5f5c4ead1` |
| Production | `https://primary-production-08595.up.railway.app/webhook/51ad3e9f-997e-490b-a495-7cd5f5c4ead1` |

**Environment Variable**: `NEXT_PUBLIC_WEBHOOK_URL`

---

## POST /webhook (Food Image Analysis)

Analyzes an uploaded food image and returns nutritional information.

### Request

**Method**: POST
**Content-Type**: multipart/form-data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | Yes | The food image file (JPEG, PNG, WebP) |

**Example Request**:
```typescript
const formData = new FormData();
formData.append('image', imageBlob, 'food.jpg');

const response = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL, {
  method: 'POST',
  body: formData,
});
```

### Response

**Content-Type**: application/json
**Status**: 200 OK

| Field | Type | Description |
|-------|------|-------------|
| `food_name` | string | AI-identified food name or description |
| `calories` | integer | Total calorie count |
| `protein` | float | Protein in grams |
| `carbs` | float | Carbohydrates in grams |
| `fat` | float | Fat in grams |

**Example Response**:
```json
{
  "food_name": "Grilled Salmon with Quinoa",
  "calories": 450,
  "protein": 35.5,
  "carbs": 28.0,
  "fat": 18.2
}
```

### Error Responses

| Status | Description | Client Action |
|--------|-------------|---------------|
| 400 | Invalid request (missing image, wrong format) | Show error, allow retry |
| 500 | Server error / AI processing failure | Retry with exponential backoff |
| 502/503/504 | Service unavailable | Retry with exponential backoff |
| Timeout | No response within 30 seconds | Retry with exponential backoff |

**Error Handling Strategy**:
1. On first failure: Wait 1s, retry
2. On second failure: Wait 2s, retry
3. On third failure: Wait 4s, retry
4. After 3 retries: Show error, suggest manual entry (FR-013a)

---

## TypeScript Interface

```typescript
// app/services/foodAnalysis.ts

export interface FoodAnalysisRequest {
  image: Blob;
}

export interface FoodAnalysisResponse {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodAnalysisError {
  message: string;
  retryable: boolean;
}
```

---

## Service Implementation Contract

```typescript
// app/services/foodAnalysis.ts

/**
 * Analyzes a food image using the n8n webhook
 *
 * @param image - The image blob to analyze
 * @returns Promise resolving to nutritional analysis
 * @throws FoodAnalysisError on failure after retries
 */
export async function analyzeFood(image: Blob): Promise<FoodAnalysisResponse>;

/**
 * Resizes an image to reduce upload size
 *
 * @param file - The original image file
 * @param maxDimension - Maximum width/height (default 1024)
 * @returns Promise resolving to resized image blob
 */
export async function resizeImage(file: File, maxDimension?: number): Promise<Blob>;
```

---

## Component Props Contracts

### ImageUpload

```typescript
// app/components/dashboard/ImageUpload.tsx

interface ImageUploadProps {
  /** Callback when image is selected */
  onImageSelect: (file: File) => void;
  /** Callback when "Enter manually" is clicked */
  onManualEntry: () => void;
  /** Currently selected image preview URL (for display) */
  previewUrl?: string;
  /** Whether to disable interactions */
  disabled?: boolean;
}
```

### AnalysisStatus

```typescript
// app/components/dashboard/AnalysisStatus.tsx

interface AnalysisStatusProps {
  /** Current analysis state */
  status: 'idle' | 'analyzing' | 'success' | 'error';
  /** Error message if status is 'error' */
  errorMessage?: string;
  /** Number of retries attempted */
  retryCount: number;
  /** Callback when retry button is clicked */
  onRetry: () => void;
  /** Callback when "Enter manually" is clicked after failure */
  onManualEntry: () => void;
}
```

### AddFoodForm (Modified)

```typescript
// app/components/dashboard/AddFoodForm.tsx

interface AddFoodFormProps {
  /** Callback when a new meal is submitted */
  onSubmit: (meal: {
    name: string;
    calories: number;
    mealType?: MealType;
    protein?: number;
    carbs?: number;
    fat?: number;
  }) => void;
  /** Callback to close/hide the form */
  onCancel: () => void;
  /** Pre-filled values from AI analysis */
  initialData?: Partial<AddFoodFormData>;
  /** Whether form was pre-filled from AI analysis */
  isFromAnalysis?: boolean;
}
```

---

## Data Flow Sequence

```
┌─────────┐       ┌──────────────┐       ┌─────────────┐       ┌─────────────┐
│  User   │       │ ImageUpload  │       │ foodAnalysis│       │   Webhook   │
└────┬────┘       └──────┬───────┘       └──────┬──────┘       └──────┬──────┘
     │                   │                      │                     │
     │ Select image      │                      │                     │
     │──────────────────>│                      │                     │
     │                   │                      │                     │
     │                   │ onImageSelect(file)  │                     │
     │                   │─────────────────────>│                     │
     │                   │                      │                     │
     │ Click "Analyze"   │                      │                     │
     │──────────────────>│                      │                     │
     │                   │                      │                     │
     │                   │                      │ resizeImage(file)   │
     │                   │                      │────────────────────>│
     │                   │                      │                     │
     │                   │                      │ POST /webhook       │
     │                   │                      │────────────────────>│
     │                   │                      │                     │
     │                   │ "Analyzing..."       │                     │
     │<──────────────────│                      │                     │
     │                   │                      │                     │
     │                   │                      │ JSON response       │
     │                   │                      │<────────────────────│
     │                   │                      │                     │
     │                   │ NutritionAnalysis    │                     │
     │                   │<─────────────────────│                     │
     │                   │                      │                     │
     │ Pre-filled form   │                      │                     │
     │<──────────────────│                      │                     │
     │                   │                      │                     │
```

---

## Notes

- Webhook is external (n8n hosted) - no backend changes needed in this project
- All image processing happens client-side before upload
- Response parsing should be defensive (handle missing fields gracefully)
- Images are never stored - discarded after analysis per spec
