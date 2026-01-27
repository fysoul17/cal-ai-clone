'use client';

import { useState, useCallback } from 'react';
import {
  MealEntry,
  MealType,
  getConsumedCalories,
  FoodImage,
  AnalysisState,
  NutritionAnalysis,
  initialAnalysisState,
  analysisToFormData,
  AddFoodFormData,
} from '@/app/types/meal';
import { mockMeals, DAILY_CALORIE_TARGET } from '@/app/data/mockMeals';
import { analyzeFood, resizeImage, isValidImageFormat } from '@/app/services/foodAnalysis';
import CalorieProgress from '@/app/components/dashboard/CalorieProgress';
import MealTimeline from '@/app/components/dashboard/MealTimeline';
import AddFoodForm from '@/app/components/dashboard/AddFoodForm';
import ImageUpload from '@/app/components/dashboard/ImageUpload';
import AnalysisStatus from '@/app/components/dashboard/AnalysisStatus';

// T033: Form mode type
type FormMode = 'image-upload' | 'manual-entry' | 'analyzing' | 'results';

export default function DashboardPage() {
  const [meals, setMeals] = useState<MealEntry[]>(mockMeals);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // T033: Form mode state
  const [formMode, setFormMode] = useState<FormMode>('image-upload');

  // T034: Selected image state
  const [selectedImage, setSelectedImage] = useState<FoodImage | null>(null);

  // T035: Analysis state
  const [analysisState, setAnalysisState] = useState<AnalysisState>(initialAnalysisState);

  // T036: Analysis result state
  const [analysisResult, setAnalysisResult] = useState<NutritionAnalysis | null>(null);

  const consumed = getConsumedCalories(meals);

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setFormMode('image-upload');
    setSelectedImage(null);
    setAnalysisState(initialAnalysisState);
    setAnalysisResult(null);
  };

  const handleCloseForm = () => {
    // Cleanup preview URL if exists
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setIsFormOpen(false);
    setFormMode('image-upload');
    setSelectedImage(null);
    setAnalysisState(initialAnalysisState);
    setAnalysisResult(null);
  };

  // T037: Handle image selection
  const handleImageSelect = useCallback((file: File) => {
    // Validate image format
    if (!isValidImageFormat(file)) {
      setAnalysisState({
        status: 'error',
        error: 'Unsupported image format. Please use JPEG, PNG, WebP, or HEIC.',
        retryCount: 0,
      });
      return;
    }

    // Cleanup previous preview URL
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage({ file, previewUrl });
    setAnalysisState({ status: 'ready', error: null, retryCount: 0 });
    setAnalysisResult(null);
  }, [selectedImage]);

  // Handle remove image
  const handleRemoveImage = useCallback(() => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
    setAnalysisState(initialAnalysisState);
    setAnalysisResult(null);
  }, [selectedImage]);

  // T038: Handle analyze action
  const handleAnalyze = useCallback(async () => {
    if (!selectedImage) return;

    setFormMode('analyzing');
    setAnalysisState((prev) => ({
      ...prev,
      status: 'analyzing',
      error: null,
    }));

    try {
      // Resize image before sending
      const resizedBlob = await resizeImage(selectedImage.file);

      // Call the webhook
      const result = await analyzeFood(resizedBlob, (attempt) => {
        setAnalysisState((prev) => ({
          ...prev,
          retryCount: attempt,
        }));
      });

      setAnalysisResult(result);
      setAnalysisState({
        status: 'success',
        error: null,
        retryCount: 0,
      });
      setFormMode('results');
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : (error as { message?: string })?.message || 'Analysis failed. Please try again.';

      setAnalysisState((prev) => ({
        status: 'error',
        error: errorMessage,
        retryCount: prev.retryCount + 1,
      }));
      setFormMode('image-upload');
    }
  }, [selectedImage]);

  // T039: Handle retry action
  const handleRetry = useCallback(() => {
    handleAnalyze();
  }, [handleAnalyze]);

  // T040: Handle manual entry
  const handleManualEntry = useCallback(() => {
    setFormMode('manual-entry');
    setAnalysisState(initialAnalysisState);
    setAnalysisResult(null);
  }, []);

  // Handle add meal (with macros)
  const handleAddMeal = (mealData: {
    name: string;
    calories: number;
    mealType?: MealType;
    protein?: number;
    carbs?: number;
    fat?: number;
  }) => {
    const newMeal: MealEntry = {
      id: crypto.randomUUID(),
      name: mealData.name,
      calories: mealData.calories,
      timestamp: new Date(),
      mealType: mealData.mealType,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fat: mealData.fat,
    };
    setMeals((prev) => [...prev, newMeal]);
    handleCloseForm();
  };

  // T042: Get initial data for form from analysis result
  const getFormInitialData = (): Partial<AddFoodFormData> | undefined => {
    if (analysisResult && formMode === 'results') {
      return analysisToFormData(analysisResult);
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-[#FF3366]/15 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-[#A0A0B8] mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </header>

        <section className="mb-8">
          <CalorieProgress consumed={consumed} target={DAILY_CALORIE_TARGET} />
        </section>

        {!isFormOpen && (
          <section className="mb-8">
            <button
              onClick={handleOpenForm}
              className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wide shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              + Add Food
            </button>
          </section>
        )}

        {/* T041: Conditional form/component rendering based on formMode */}
        {isFormOpen && (
          <section className="mb-8">
            <div className="rounded-3xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 p-6 animate-[fadeInUp_0.3s_ease-out]">
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {formMode === 'results' ? 'Review & Save' : 'Add Food'}
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-[#A0A0B8] hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Image upload mode */}
              {formMode === 'image-upload' && (
                <>
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    onManualEntry={handleManualEntry}
                    previewUrl={selectedImage?.previewUrl}
                    onRemoveImage={handleRemoveImage}
                    disabled={analysisState.status === 'analyzing'}
                  />

                  {/* T043: Analyze button when image is selected */}
                  {selectedImage && analysisState.status === 'ready' && (
                    <button
                      onClick={handleAnalyze}
                      className="w-full mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wide shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Analyze Food
                    </button>
                  )}

                  {/* Show error state in image upload mode */}
                  {analysisState.status === 'error' && (
                    <AnalysisStatus
                      status={analysisState.status}
                      errorMessage={analysisState.error || undefined}
                      retryCount={analysisState.retryCount}
                      onRetry={handleRetry}
                      onManualEntry={handleManualEntry}
                    />
                  )}
                </>
              )}

              {/* Analyzing mode */}
              {formMode === 'analyzing' && (
                <AnalysisStatus
                  status="analyzing"
                  retryCount={analysisState.retryCount}
                  onRetry={handleRetry}
                  onManualEntry={handleManualEntry}
                />
              )}

              {/* Results mode - show pre-filled form */}
              {formMode === 'results' && (
                <div className="-m-6">
                  <AddFoodForm
                    onSubmit={handleAddMeal}
                    onCancel={handleCloseForm}
                    initialData={getFormInitialData()}
                    isFromAnalysis={true}
                  />
                </div>
              )}

              {/* Manual entry mode */}
              {formMode === 'manual-entry' && (
                <div className="-m-6">
                  <AddFoodForm
                    onSubmit={handleAddMeal}
                    onCancel={handleCloseForm}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mb-8">
          <MealTimeline meals={meals} onAddClick={handleOpenForm} />
        </section>
      </main>
    </div>
  );
}
