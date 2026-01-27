-- Migration: Create food_logs table
-- Description: Stores user food log entries with nutritional information

CREATE TABLE public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  protein REAL DEFAULT 0 CHECK (protein >= 0),
  carbs REAL DEFAULT 0 CHECK (carbs >= 0),
  fat REAL DEFAULT 0 CHECK (fat >= 0),
  meal_type TEXT CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack')),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_food_logs_user_id ON public.food_logs(user_id);
CREATE INDEX idx_food_logs_user_date ON public.food_logs(user_id, logged_at);

-- RLS Policies
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own food logs" ON public.food_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food logs" ON public.food_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food logs" ON public.food_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food logs" ON public.food_logs
  FOR DELETE USING (auth.uid() = user_id);
