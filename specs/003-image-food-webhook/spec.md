# Feature Specification: Image-Based Food Input with AI Analysis

**Feature Branch**: `003-image-food-webhook`
**Created**: 2026-01-27
**Status**: Draft
**Input**: User description: "Add image upload for food input, send images to n8n webhook for AI analysis, and process returned nutritional data"

## Clarifications

### Session 2026-01-27

- Q: How should users access the image upload feature from the dashboard? → A: Use existing "+ Add" button; opens image upload (drag-and-drop or click-to-browse) as primary input, with small text link below for manual entry fallback
- Q: How many retry attempts should be allowed when AI analysis fails? → A: 3 retry attempts with exponential backoff, then suggest manual entry
- Q: Should the uploaded food image be persisted after AI analysis? → A: No, discard after analysis; only store nutritional data
- Q: How should macronutrient values be displayed to users? → A: 1 decimal place (e.g., 25.5g protein)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture Food Photo (Priority: P1)

As a user, I want to upload or capture a photo of my food so that I can log my meals without manually entering nutritional information.

**Why this priority**: This is the core functionality that enables the entire feature. Without image capture capability, no other functionality works.

**Independent Test**: Can be fully tested by uploading an image and verifying it displays as a preview. Delivers immediate value by simplifying the food logging process.

**Acceptance Scenarios**:

1. **Given** I am on the dashboard, **When** I tap the "+ Add" button, **Then** I see an image upload area (drag-and-drop zone or click to browse) as the primary input method
2. **Given** I am viewing the image upload area, **When** I drag and drop an image or click to browse, **Then** I can select an image from my device
3. **Given** I am viewing the image upload area, **When** I want to manually enter food data instead, **Then** I can click a small text link below the upload area to reveal the manual entry form
4. **Given** I have selected an image, **When** the image loads, **Then** I see a preview of the selected food photo
3. **Given** I see the image preview, **When** I want to change the image, **Then** I can tap to select a different image
4. **Given** I have selected an image, **When** I tap the remove/clear button, **Then** the image is removed and I can select a new one

---

### User Story 2 - Analyze Food via AI (Priority: P1)

As a user, I want the system to automatically analyze my food photo and identify the food with its nutritional information so that I don't have to manually look up calorie data.

**Why this priority**: This is the key value proposition of the feature - automating nutrition identification from photos.

**Independent Test**: Can be tested by uploading an image, triggering analysis, and verifying the system sends data to the webhook and processes the response.

**Acceptance Scenarios**:

1. **Given** I have uploaded a food image, **When** I tap the analyze button, **Then** the system sends the image to the AI analysis service
2. **Given** the system is analyzing my image, **When** the analysis is in progress, **Then** I see a loading indicator showing the analysis status
3. **Given** the AI has analyzed my image, **When** the results are returned, **Then** I see the identified food name and nutritional information (calories, protein, carbs, fat)
4. **Given** the AI analysis fails, **When** an error occurs, **Then** I see a user-friendly error message and can retry the analysis

---

### User Story 3 - Review and Save Analyzed Food (Priority: P2)

As a user, I want to review the AI-identified food information and save it to my daily log so that I can track my calorie intake.

**Why this priority**: This completes the user flow by allowing users to save analyzed food to their daily log. Dependent on P1 stories.

**Independent Test**: Can be tested by verifying that analyzed food data pre-fills the form fields and can be saved to the meal log.

**Acceptance Scenarios**:

1. **Given** the AI has returned food analysis results, **When** I view the results, **Then** the food name and nutritional values are pre-filled in the form
2. **Given** the form is pre-filled with AI results, **When** I want to make adjustments, **Then** I can edit any of the values before saving
3. **Given** the form has valid food data (from AI or edited), **When** I tap save/add, **Then** the food entry is added to my daily meal log
4. **Given** I have saved the food entry, **When** I return to the dashboard, **Then** I see the new entry in my meal timeline with updated calorie totals

---

### User Story 4 - Meal Type Selection (Priority: P3)

As a user, I want to optionally categorize my food by meal type (Breakfast, Lunch, Dinner, Snack) when saving analyzed food.

**Why this priority**: Nice-to-have categorization that enhances organization but is not essential for core functionality.

**Independent Test**: Can be tested by selecting a meal type during food entry and verifying it appears correctly in the meal log.

**Acceptance Scenarios**:

1. **Given** I have food data ready to save (from AI analysis), **When** I view the save form, **Then** I can optionally select a meal type
2. **Given** I have selected a meal type, **When** I save the food entry, **Then** the meal type is recorded with the entry

---

### Edge Cases

- What happens when the user uploads a non-food image (e.g., a person, landscape)?
  - The system displays the AI response as-is; users can edit or cancel
- What happens when the image is too large or in an unsupported format?
  - The system validates image format (JPEG, PNG, WebP, HEIC) and shows an error for unsupported formats
  - Large images are resized on the client before upload (max 1280px longest edge, JPEG 85% quality, target < 500KB)
- What happens when the network connection is lost during analysis?
  - The system shows a connection error message and allows retry
- What happens when the webhook service is unavailable?
  - The system shows a service unavailable error and allows up to 3 retries with exponential backoff (1s, 2s, 4s), then suggests manual entry
- What happens when the AI returns incomplete nutritional data?
  - The system displays whatever data was returned; missing fields show as empty/zero and users can fill in manually

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to upload images from their device (file picker)
- **FR-002**: System MUST accept image formats: JPEG, PNG, WebP, and HEIC
- **FR-003**: System MUST display a preview of the selected image before analysis
- **FR-004**: System MUST allow users to remove/change the selected image before submitting
- **FR-004a**: System MUST provide a manual entry fallback link below the image upload area that reveals the existing manual food entry form
- **FR-005**: System MUST send the uploaded image to the configured webhook endpoint
- **FR-006**: System MUST send the image as multipart/form-data with the field name 'image'
- **FR-007**: System MUST display a loading state while waiting for analysis results
- **FR-008**: System MUST process the webhook response containing: food_name (string), calories (integer), protein (float), carbs (float), fat (float)
- **FR-008a**: System MUST display macronutrient values (protein, carbs, fat) with 1 decimal place precision (e.g., 25.5g)
- **FR-009**: System MUST pre-fill the food entry form with the analyzed nutritional data
- **FR-010**: System MUST allow users to edit the pre-filled values before saving
- **FR-011**: System MUST allow users to save the food entry to their daily meal log
- **FR-012**: System MUST display appropriate error messages when analysis fails
- **FR-013**: System MUST allow users to retry failed analysis attempts (maximum 3 retries with exponential backoff: 1s, 2s, 4s)
- **FR-013a**: System MUST suggest manual entry after 3 failed retry attempts
- **FR-014**: System MUST support switching between test and production webhook URLs via environment configuration

### Key Entities

- **FoodImage**: Transient object representing the uploaded image file during analysis (file data, preview URL, upload status); discarded after analysis completes - not persisted
- **NutritionAnalysis**: Represents the AI analysis result (food_name, calories as integer, protein/carbs/fat as floats displayed to 1 decimal place)
- **MealEntry**: Extended to include protein, carbs, and fat in addition to existing fields (id, name, calories, timestamp, mealType)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can upload a food image and receive nutritional analysis results within 30 seconds under normal network conditions
- **SC-002**: 95% of successful image uploads result in a parseable nutritional response from the AI service
- **SC-003**: Users can complete the full flow (upload → analyze → save) in under 60 seconds
- **SC-004**: Error states are clearly communicated with actionable messages (retry option available)
- **SC-005**: Food entries saved from AI analysis include all returned nutritional data (calories, protein, carbs, fat)
- **SC-006**: Users can successfully edit AI-analyzed values before saving

## Assumptions

- The n8n webhook service is operational and returns responses in the documented JSON format
- Network latency for webhook communication is reasonable (under 20 seconds for AI processing)
- Users have access to a camera or image gallery on their device
- The existing MealEntry type can be extended to include additional nutritional fields (protein, carbs, fat)
- Image resizing/compression will be handled client-side to reduce upload time
- The webhook URLs are provided via environment variables for flexibility between environments

## Configuration

- **Test Webhook URL**: `https://primary-production-08595.up.railway.app/webhook-test/51ad3e9f-997e-490b-a495-7cd5f5c4ead1`
- **Production Webhook URL**: `https://primary-production-08595.up.railway.app/webhook/51ad3e9f-997e-490b-a495-7cd5f5c4ead1`
- **Image Field Name**: `image` (as expected by n8n webhook)

## Expected Webhook Response Format

```json
{
  "food_name": "A concise, descriptive name of the meal (e.g., 'Grilled Salmon with Quinoa')",
  "calories": 0,
  "protein": 0.0,
  "carbs": 0.0,
  "fat": 0.0
}
```
