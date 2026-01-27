# Quickstart: Image-Based Food Input with AI Analysis

**Feature**: 003-image-food-webhook
**Date**: 2026-01-27

## Overview

Quick reference for implementing the image-based food input feature with AI analysis via n8n webhook.

---

## Environment Setup

### 1. Add Environment Variable

Create or update `.env.local`:

```bash
# For testing
NEXT_PUBLIC_WEBHOOK_URL=https://primary-production-08595.up.railway.app/webhook-test/51ad3e9f-997e-490b-a495-7cd5f5c4ead1

# For production (.env.production)
NEXT_PUBLIC_WEBHOOK_URL=https://primary-production-08595.up.railway.app/webhook/51ad3e9f-997e-490b-a495-7cd5f5c4ead1
```

### 2. Restart Dev Server

```bash
npm run dev
```

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `app/types/meal.ts` | MODIFY | Add NutritionAnalysis, extend MealEntry with macros |
| `app/services/foodAnalysis.ts` | CREATE | Webhook integration service |
| `app/components/dashboard/ImageUpload.tsx` | CREATE | Drag-drop image upload component |
| `app/components/dashboard/AnalysisStatus.tsx` | CREATE | Loading/error states component |
| `app/components/dashboard/AddFoodForm.tsx` | MODIFY | Add macro fields, support pre-fill |
| `app/components/dashboard/MealEntry.tsx` | MODIFY | Display macros if present |
| `app/dashboard/page.tsx` | MODIFY | Orchestrate image upload flow |
| `.env.local` | CREATE | Add webhook URL |

---

## Implementation Order

### Phase 1: Core Types & Service

1. **Update `app/types/meal.ts`**
   - Add `NutritionAnalysis` interface
   - Add `FoodImage` interface
   - Add `AnalysisState` type
   - Extend `MealEntry` with protein, carbs, fat
   - Extend `AddFoodFormData` with macro fields
   - Add helper functions

2. **Create `app/services/foodAnalysis.ts`**
   - `resizeImage()` function
   - `analyzeFood()` function with retry logic

### Phase 2: UI Components

3. **Create `app/components/dashboard/ImageUpload.tsx`**
   - Drag-and-drop zone
   - Click-to-browse fallback
   - Image preview
   - "Enter manually" link

4. **Create `app/components/dashboard/AnalysisStatus.tsx`**
   - Loading spinner
   - Error display with retry button
   - Suggest manual entry after failures

5. **Modify `app/components/dashboard/AddFoodForm.tsx`**
   - Add protein, carbs, fat input fields
   - Accept `initialData` prop for pre-fill
   - Handle numeric validation for macros

### Phase 3: Integration

6. **Modify `app/dashboard/page.tsx`**
   - Add form mode state (image-upload | manual-entry)
   - Handle image selection
   - Trigger analysis on button click
   - Pass results to AddFoodForm
   - Handle retry flow

7. **Modify `app/components/dashboard/MealEntry.tsx`**
   - Display macro pills when present

---

## Key Patterns

### Image Resize Pattern

```typescript
async function resizeImage(file: File, maxDimension = 1024): Promise<Blob> {
  const img = await createImageBitmap(file);
  const scale = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
  const canvas = document.createElement('canvas');
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85);
  });
}
```

### Webhook Call Pattern

```typescript
async function analyzeFood(imageBlob: Blob): Promise<NutritionAnalysis> {
  const formData = new FormData();
  formData.append('image', imageBlob, 'food.jpg');

  const response = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL!, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.status}`);
  }

  return response.json();
}
```

### Retry Pattern

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  const delays = [1000, 2000, 4000];
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  }

  throw lastError!;
}
```

### Drag-Drop Pattern

```typescript
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(true);
};

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false);
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    onImageSelect(file);
  }
};
```

---

## Testing Checklist

- [ ] Upload JPEG image - shows preview
- [ ] Upload PNG image - shows preview
- [ ] Upload invalid file type - shows error
- [ ] Drag-drop image - shows preview
- [ ] Click "Analyze" - shows loading state
- [ ] Successful analysis - form pre-filled
- [ ] Edit pre-filled values - works
- [ ] Save analyzed food - appears in timeline
- [ ] Retry on failure - retries 3 times
- [ ] After 3 failures - shows manual entry option
- [ ] "Enter manually" link - shows empty form
- [ ] Macros display in saved entries

---

## Common Issues

### CORS Error
The n8n webhook should have CORS headers configured. If you see CORS errors:
- Check webhook URL is correct
- Verify webhook is active in n8n

### Image Upload Fails
- Check file size (large images may timeout)
- Verify image format is supported (JPEG, PNG, WebP, HEIC)
- Check network connectivity

### Environment Variable Not Found
- Restart dev server after adding `.env.local`
- Use `NEXT_PUBLIC_` prefix for client-side access

---

## Design System Reference

Follow `docs/design-system.md` for:
- Colors: Error states use `#EF4444`, loading uses primary gradient
- Buttons: Pill style (`rounded-full`)
- Cards: `rounded-3xl` with surface gradient
- Inputs: `rounded-xl` with 2px border
- Spacing: Use 4px base unit scale
- Animation: `fadeInUp` for new elements
