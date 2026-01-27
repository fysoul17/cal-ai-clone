# Research: Image-Based Food Input with AI Analysis

**Feature**: 003-image-food-webhook
**Date**: 2026-01-27

## Overview

Research findings for implementing image-based food input with n8n webhook integration for AI nutritional analysis.

---

## Research Items

### 1. Image Upload in React/Next.js

**Decision**: Use native HTML file input with drag-and-drop zone using React event handlers.

**Rationale**:
- No external library needed - reduces bundle size and complexity
- Native `<input type="file" accept="image/*">` handles file picker
- Drag-and-drop via `onDragOver`, `onDrop` events on a container div
- React state for preview using `URL.createObjectURL()`

**Alternatives considered**:
- react-dropzone: Full-featured but adds ~10KB dependency for simple use case
- react-images-uploading: Similar overkill for single-image upload
- Uppy: Enterprise-grade, way too complex for this feature

**Implementation approach**:
```tsx
// Simplified pattern
const [file, setFile] = useState<File | null>(null);
const [preview, setPreview] = useState<string | null>(null);

const handleFile = (f: File) => {
  setFile(f);
  setPreview(URL.createObjectURL(f));
};
```

---

### 2. Supported Image Formats

**Decision**: Accept JPEG, PNG, WebP, and HEIC formats (FR-002).

**Rationale**:
- JPEG/PNG: Universal web support
- WebP: Modern format, widely supported
- HEIC: iPhone default format (iOS 11+), converts on upload

**Implementation approach**:
```tsx
// Accept attribute for file input
accept="image/jpeg,image/png,image/webp,image/heic"

// Validation in handler
const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
if (!validTypes.includes(file.type)) {
  setError('Please upload a JPEG, PNG, WebP, or HEIC image');
}
```

---

### 3. Client-Side Image Resizing

**Decision**: Use Canvas API for client-side image resizing before upload.

**Rationale**:
- Native browser API, no dependencies
- Reduces bandwidth and upload time
- Can target max dimension (e.g., 1024px) while preserving aspect ratio

**Alternatives considered**:
- browser-image-compression: Good library but adds dependency
- pica: High quality but complex for simple resize
- Sending full-size image: Wastes bandwidth, slower uploads

**Implementation approach**:
```tsx
async function resizeImage(file: File, maxDimension: number = 1024): Promise<Blob> {
  const img = await createImageBitmap(file);
  const scale = Math.min(maxDimension / img.width, maxDimension / img.height, 1);
  const canvas = document.createElement('canvas');
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
}
```

---

### 4. Webhook Request Format

**Decision**: Send image as multipart/form-data with field name 'image' (FR-005, FR-006).

**Rationale**:
- n8n webhook expects multipart/form-data for file uploads
- Standard approach for file transmission
- Field name 'image' per spec configuration

**Implementation approach**:
```tsx
async function analyzeFood(imageBlob: Blob): Promise<NutritionAnalysis> {
  const formData = new FormData();
  formData.append('image', imageBlob, 'food.jpg');

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
```

---

### 5. Retry Logic with Exponential Backoff

**Decision**: Implement 3 retries with 1s, 2s, 4s delays (FR-013).

**Rationale**:
- Handles transient network/service failures
- Exponential backoff prevents hammering failed service
- 3 attempts matches spec requirement

**Implementation approach**:
```tsx
async function fetchWithRetry(
  fn: () => Promise<Response>,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error;
  const delays = [1000, 2000, 4000]; // exponential backoff

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fn();
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, delays[attempt]));
      }
    }
  }
  throw lastError;
}
```

---

### 6. Environment Configuration

**Decision**: Use Next.js environment variables with NEXT_PUBLIC_ prefix (FR-014).

**Rationale**:
- Client-side component needs webhook URL
- NEXT_PUBLIC_ prefix exposes to browser
- Allows switching between test/prod webhooks

**Implementation approach**:
```bash
# .env.local
NEXT_PUBLIC_WEBHOOK_URL=https://primary-production-08595.up.railway.app/webhook-test/51ad3e9f-997e-490b-a495-7cd5f5c4ead1

# Production
NEXT_PUBLIC_WEBHOOK_URL=https://primary-production-08595.up.railway.app/webhook/51ad3e9f-997e-490b-a495-7cd5f5c4ead1
```

---

### 7. Webhook Response Format

**Decision**: Parse JSON response matching spec format.

**Rationale**:
- Expected format documented in spec
- All fields present in response
- Display floats to 1 decimal place (FR-008a)

**Expected response**:
```json
{
  "food_name": "Grilled Salmon with Quinoa",
  "calories": 450,
  "protein": 35.5,
  "carbs": 28.0,
  "fat": 18.2
}
```

---

### 8. HEIC Format Handling

**Decision**: Rely on browser support; Safari handles HEIC natively, Chrome/Firefox need conversion.

**Rationale**:
- Safari (macOS/iOS) has native HEIC support
- For Chrome/Firefox, HEIC files may fail - user can take photo in JPEG format
- Full HEIC support would require heic2any library (~20KB)

**Alternatives considered**:
- heic2any library: Adds significant bundle size for edge case
- Server-side conversion: Adds backend complexity
- Accept only JPEG/PNG/WebP: Limits iPhone users

**Decision**: Accept HEIC in file picker, but display error if browser can't decode. Users can retake photo or choose different format.

---

### 9. Loading States & UX

**Decision**: Show spinner with status text during analysis.

**Rationale**:
- FR-007 requires loading state
- Clear feedback during 20-30 second AI processing
- Match design system animation patterns

**Implementation approach**:
```tsx
// States: 'idle' | 'uploading' | 'analyzing' | 'success' | 'error'
const statusMessages = {
  uploading: 'Uploading image...',
  analyzing: 'Analyzing your meal...',
  error: 'Analysis failed. Tap to retry.',
};
```

---

### 10. Form Integration Pattern

**Decision**: Image upload opens in place of form; results pre-fill form fields.

**Rationale**:
- FR-009: Pre-fill form with analyzed data
- FR-010: Allow editing before save
- Reuse existing AddFoodForm component

**Flow**:
1. User clicks "+ Add" button
2. Show ImageUpload component (primary) with "Enter manually" link
3. After successful analysis, show AddFoodForm pre-filled with results
4. User can edit and save

---

## Summary

All research items resolved. No NEEDS CLARIFICATION remaining. Ready for Phase 1 design.

| Item | Decision | Rationale |
|------|----------|-----------|
| Image upload | Native file input + drag-drop | No dependencies needed |
| Formats | JPEG, PNG, WebP, HEIC | Per FR-002 |
| Resizing | Canvas API | Native, efficient |
| Webhook | FormData with 'image' field | Per FR-005, FR-006 |
| Retry | 3 attempts, 1s/2s/4s delays | Per FR-013 |
| Environment | NEXT_PUBLIC_ vars | Client-side access |
| Response | JSON per spec format | Direct mapping |
| HEIC | Browser-dependent support | Accept gracefully |
| Loading | Spinner with status text | Per FR-007 |
| Integration | Pre-fill existing form | Per FR-009, FR-010 |
