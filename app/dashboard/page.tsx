'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  MealType,
  getConsumedCalories,
  FoodImage,
  AnalysisState,
  NutritionAnalysis,
  initialAnalysisState,
  analysisToFormData,
  AddFoodFormData,
} from '@/app/types/meal';
import { DAILY_CALORIE_TARGET } from '@/app/data/mockMeals';
import { analyzeFood, resizeImage, isValidImageFormat } from '@/app/services/foodAnalysis';
import { useFoodLogs } from '@/app/hooks/useFoodLogs';
import { createClient } from '@/lib/supabase/client';
import CalorieProgress from '@/app/components/dashboard/CalorieProgress';
import MealTimeline from '@/app/components/dashboard/MealTimeline';
import AddFoodForm from '@/app/components/dashboard/AddFoodForm';
import ImageUpload from '@/app/components/dashboard/ImageUpload';
import AnalysisStatus from '@/app/components/dashboard/AnalysisStatus';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';

// T033: Form mode type
type FormMode = 'image-upload' | 'manual-entry' | 'analyzing' | 'results';

export default function DashboardPage() {
  // Use database-backed food logs hook
  const { meals, isLoading, error, addMeal } = useFoodLogs();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // User state for webhook authentication
  const [userId, setUserId] = useState<string | null>(null);

  // T033: Form mode state
  const [formMode, setFormMode] = useState<FormMode>('image-upload');

  // T034: Selected image state
  const [selectedImage, setSelectedImage] = useState<FoodImage | null>(null);

  // Selected meal type for analysis
  const [selectedMealType, setSelectedMealType] = useState<MealType | undefined>(undefined);

  // T035: Analysis state
  const [analysisState, setAnalysisState] = useState<AnalysisState>(initialAnalysisState);

  // T036: Analysis result state
  const [analysisResult, setAnalysisResult] = useState<NutritionAnalysis | null>(null);

  // Fetch user on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const consumed = getConsumedCalories(meals);

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setFormMode('image-upload');
    setSelectedImage(null);
    setSelectedMealType(undefined);
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
    setSelectedMealType(undefined);
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

    if (!userId) {
      setAnalysisState({
        status: 'error',
        error: 'Please log in to analyze food images.',
        retryCount: 0,
      });
      return;
    }

    setFormMode('analyzing');
    setAnalysisState((prev) => ({
      ...prev,
      status: 'analyzing',
      error: null,
    }));

    try {
      // Resize image before sending
      const resizedBlob = await resizeImage(selectedImage.file);

      // Call the webhook with user_id and optional meal_type
      const result = await analyzeFood({
        image: resizedBlob,
        userId,
        mealType: selectedMealType,
        onRetry: (attempt) => {
          setAnalysisState((prev) => ({
            ...prev,
            retryCount: attempt,
          }));
        },
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
  }, [selectedImage, userId, selectedMealType]);

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

  // Handle add meal (with macros) - now persists to database
  const handleAddMeal = async (mealData: {
    name: string;
    calories: number;
    mealType?: MealType;
    protein?: number;
    carbs?: number;
    fat?: number;
  }) => {
    setSubmitError(null);
    try {
      await addMeal({
        name: mealData.name,
        calories: mealData.calories,
        timestamp: new Date(),
        mealType: mealData.mealType,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
      });
      handleCloseForm();
    } catch {
      setSubmitError('Failed to save meal. Please try again.');
    }
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
        <DashboardHeader />

        <section className="mb-8">
          <CalorieProgress consumed={consumed} target={DAILY_CALORIE_TARGET} />
        </section>

        {/* Error notification for data loading/saving errors */}
        {(error || submitError) && (
          <section className="mb-4">
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error || submitError}</p>
            </div>
          </section>
        )}

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

                  {/* Meal type selector (optional) */}
                  {selectedImage && analysisState.status === 'ready' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-[#A0A0B8] mb-2">
                        Meal Type (optional)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedMealType(selectedMealType === type ? undefined : type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              selectedMealType === type
                                ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white'
                                : 'bg-white/5 text-[#A0A0B8] hover:bg-white/10'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
          {isLoading ? (
            <div className="rounded-3xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 p-8 flex items-center justify-center">
              <div className="flex items-center gap-3 text-[#A0A0B8]">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Loading meals...</span>
              </div>
            </div>
          ) : (
            <MealTimeline meals={meals} onAddClick={handleOpenForm} />
          )}
        </section>
      </main>
    </div>
  );
}
