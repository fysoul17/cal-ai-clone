'use client';

import { useState } from 'react';
import { MealEntry, MealType, getConsumedCalories } from '@/app/types/meal';
import { mockMeals, DAILY_CALORIE_TARGET } from '@/app/data/mockMeals';
import CalorieProgress from '@/app/components/dashboard/CalorieProgress';
import MealTimeline from '@/app/components/dashboard/MealTimeline';
import AddFoodForm from '@/app/components/dashboard/AddFoodForm';

export default function DashboardPage() {
  const [meals, setMeals] = useState<MealEntry[]>(mockMeals);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const consumed = getConsumedCalories(meals);

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const handleAddMeal = (mealData: { name: string; calories: number; mealType?: MealType }) => {
    const newMeal: MealEntry = {
      id: crypto.randomUUID(),
      name: mealData.name,
      calories: mealData.calories,
      timestamp: new Date(),
      mealType: mealData.mealType,
    };
    setMeals((prev) => [...prev, newMeal]);
    setIsFormOpen(false);
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

        {isFormOpen && (
          <section className="mb-8">
            <AddFoodForm onSubmit={handleAddMeal} onCancel={handleCloseForm} />
          </section>
        )}

        <section className="mb-8">
          <MealTimeline meals={meals} onAddClick={handleOpenForm} />
        </section>
      </main>
    </div>
  );
}
