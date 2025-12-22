# Product Requirements Document (PRD) - Cal AI Web Clone

## 1. Project Overview
**Project Name**: Cal AI Web Clone
**Platform**: Web Application (Responsive Mobile-First Design)
**Description**: A comprehensive AI-powered nutrition tracker that simplifies calorie counting. Users upload photos of their food, and the system uses AI to analyze the image, identify the food, and provide a detailed nutritional report (calories, macros). Users can save these logs to track their daily intake.

## 2. Goals & Objectives
*   **Simplify Tracking**: Remove the friction of manual entry by using photo-based analysis.
*   **Accurate Reporting**: Provide estimated calories, protein, carbs, and fat for analyzed foods.
*   **History & Trends**: Allow users to view their daily consumption history.
*   **Web-First**: Deliver a native-app-like experience in a web browser.

## 3. Tech Stack
*   **Frontend Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: TailwindCSS (with a premium, modern design aesthetic)
*   **State Management**: React Server Components / Server Actions
*   **Backend / API Strategy**:
    *   **Server Actions**: Primary method for data mutation and fetching from the client.
    *   **n8n Webhooks**: Used for heavy-lifting AI processing or complex backend workflows. The Next.js app will trigger n8n webhooks for image analysis.
*   **Database & Auth**: Supabase
    *   **Auth**: Email/Password, Social Login (Google/Apple - optional).
    *   **Database**: Postgres (managed by Supabase).
    *   **Storage**: Supabase Storage (for food images).

## 4. Key Features

### 4.1. Authentication
*   User Sign Up / Sign In using Supabase Auth.
*   Protected routes for Dashboard and Logging.

### 4.2. Food Analysis (Core Feature)
*   **Input**: User uploads an image (camera capture or gallery).
*   **Process**:
    1.  Image uploaded to Supabase Storage.
    2.  Server Action triggers an n8n webhook with the image URL/Binary.
    3.  n8n workflow processes the image (via LLM/Vision API) and returns structured JSON (Name, Calories, Macros).
*   **Output**: Display a "Analysis Report" to the user for verification.

### 4.3. Nutrition Report & Logging
*   **Review**: User sees the AI's estimation.
*   **Edit**: User can adjust the portion size or correct the food name if needed (Phase 2, Phase 1 read-only/confirm).
*   **Save**: User confirms the entry, saving it to their Daily Log in Supabase.

### 4.4. Daily Dashboard
*   **Summary**: Progress bar or circular chart showing daily calorie intake vs. goal.
*   **Timeline**: List of meals logged today with timestamps and thumbnails.
*   **History**: Calendar view to see past days (optional for MVP, good for stickiness).

## 5. Data Model (Supabase Schema Proposal)

### `users` (managed by Supabase Auth)
*   `id`: UUID
*   `email`: string
*   `full_name`: string
*   `daily_calorie_goal`: integer (default: 2000)

### `food_logs`
*   `id`: UUID (Primary Key)
*   `user_id`: UUID (Foreign Key -> users.id)
*   `image_url`: string (Supabase Storage path)
*   `food_name`: string
*   `calories`: integer
*   `protein`: float
*   `carbs`: float
*   `fat`: float
*   `created_at`: timestamp (default: now())
*   `meal_type`: string (Breakfast, Lunch, Dinner, Snack) - *Optional inferred or selected*

## 6. User Flow
1.  **Landing**: Minimalist landing page explaining the value prop -> "Start Tracking".
2.  **Auth**: Login/Register.
3.  **Dashboard**: Shows today's summary. Large "Add Food" (+) button.
4.  **Add Food**:
    *   Select/Take Photo.
    *   "Analyzing..." loading state.
    *   **Result Modal**: Shows identified food and stats.
    *   "Save Log" button.
5.  **Post-Save**: Redirect back to Dashboard with updated stats.

## 7. Integration Details (n8n)
*   **Trigger**: Webhook (POST) receiving image data.
*   **Logic**:
    *   Receive Image.
    *   Send to Vision Model (e.g., GPT-4o, Gemini Flash).
    *   Prompt: "Identify the food, estimate portion, and return JSON with {food_name, calories, protein, carbs, fat}."
    *   Return JSON response to Next.js.
*   **Next.js Handling**:
    *   `uploadImage` Server Action handles upload.
    *   `analyzeFood` Server Action calls n8n webhook and parses result.

## 8. Design Guidelines (Aesthetics)
*   **Theme**: Modern, clean, "Health & Tech" fusion. High contrast, possibly dark mode by default for premium feel.
*   **Typography**: Clean sans-serif (Inter or similar).
*   **Visuals**: Rounded corners, smooth transitions, high-quality skeleton loaders.

## 9. Open Questions & Clarifications
*   **AI Provider**: Does the n8n workflow connect to a specific AI provider (OpenAI, Anthropic, Google)?
*   **Detailed Metrics**: Do we need micronutrients (Vitamins, etc.) or just Macros (Protein, Carbs, Fat)?
*   **Subscription**: Is this a paid SaaS or free tool for now? (affects user limitations).
