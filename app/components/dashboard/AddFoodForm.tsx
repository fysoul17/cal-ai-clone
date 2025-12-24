'use client';

import { useState } from 'react';
import { MealType, AddFoodFormData, initialFormData } from '@/app/types/meal';

interface AddFoodFormProps {
  onSubmit: (meal: { name: string; calories: number; mealType?: MealType }) => void;
  onCancel: () => void;
}

const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function AddFoodForm({ onSubmit, onCancel }: AddFoodFormProps) {
  const [formData, setFormData] = useState<AddFoodFormData>(initialFormData);
  const [errors, setErrors] = useState<{ name?: string; calories?: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { name?: string; calories?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required';
    }

    const caloriesNum = parseInt(formData.calories, 10);
    if (!formData.calories || isNaN(caloriesNum) || caloriesNum < 1) {
      newErrors.calories = 'Calories must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      calories: parseInt(formData.calories, 10),
      mealType: formData.mealType || undefined,
    });

    setFormData(initialFormData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 p-6 animate-[fadeInUp_0.3s_ease-out]"
    >
      <h2 className="text-xl font-bold text-white mb-6">Add Food</h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-[#A0A0B8] uppercase tracking-wider mb-2"
          >
            Food Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Grilled Chicken Salad"
            className={`w-full px-4 py-3 rounded-xl bg-[#0F0F1A] border-2 text-white placeholder-[#6B6B80] focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] transition-all ${
              errors.name ? 'border-[#EF4444]' : 'border-white/10'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-[#EF4444]">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="calories"
            className="block text-sm font-semibold text-[#A0A0B8] uppercase tracking-wider mb-2"
          >
            Calories
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            placeholder="e.g., 450"
            min="1"
            className={`w-full px-4 py-3 rounded-xl bg-[#0F0F1A] border-2 text-white placeholder-[#6B6B80] focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] transition-all ${
              errors.calories ? 'border-[#EF4444]' : 'border-white/10'
            }`}
          />
          {errors.calories && (
            <p className="mt-1 text-sm text-[#EF4444]">{errors.calories}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="mealType"
            className="block text-sm font-semibold text-[#A0A0B8] uppercase tracking-wider mb-2"
          >
            Meal Type <span className="font-normal">(optional)</span>
          </label>
          <select
            id="mealType"
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#0F0F1A] border-2 border-white/10 text-white focus:outline-none focus:border-[#FF6B35] focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] transition-all appearance-none cursor-pointer"
          >
            <option value="">Select meal type</option>
            {mealTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-full border-2 border-white/20 text-white font-bold uppercase tracking-wide hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wide shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all duration-300"
        >
          Add Food
        </button>
      </div>
    </form>
  );
}
