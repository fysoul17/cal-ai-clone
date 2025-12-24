# Feature Specification: Daily Dashboard

**Feature Branch**: `002-daily-dashboard`
**Created**: 2025-12-24
**Status**: Draft
**Input**: User description: "Daily dashboard showing calorie progress, meal timeline, and add food button. bypass supabase auth for now. we will add later. Data should be fake data for now since we do not have database integrated yet. Focus on UI/UX for now, do not overengineering, make it intuitive UI/UX"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Daily Calorie Progress (Priority: P1)

As a user, I want to see my daily calorie progress at a glance so I can understand how close I am to my daily goal.

**Why this priority**: This is the core value proposition of the dashboard - users need immediate visual feedback on their calorie consumption to make informed food choices throughout the day.

**Independent Test**: Can be fully tested by viewing the dashboard with mock calorie data and observing the progress indicator. Delivers the primary value of calorie awareness.

**Acceptance Scenarios**:

1. **Given** a user opens the dashboard, **When** the page loads, **Then** they see a horizontal progress bar showing consumed vs target calories with percentage
2. **Given** a user has consumed some calories, **When** they view the progress bar, **Then** they see the remaining calories clearly displayed alongside the bar
3. **Given** a user has exceeded their daily goal, **When** they view the progress bar, **Then** the bar shows 100%+ and clearly indicates they are over their target

---

### User Story 2 - View Meal Timeline (Priority: P2)

As a user, I want to see a chronological timeline of my meals for the day so I can track what I've eaten and when.

**Why this priority**: Understanding meal patterns helps users make better food choices. This builds on the calorie summary by providing context.

**Independent Test**: Can be fully tested by viewing the timeline section with mock meal entries. Delivers value through meal pattern visibility.

**Acceptance Scenarios**:

1. **Given** a user has logged meals for the day, **When** they view the meal timeline, **Then** they see all meals listed in chronological order
2. **Given** a meal entry exists, **When** the user views the timeline, **Then** they see the meal name, time, calorie count, and meal type (if provided) for each entry
3. **Given** no meals have been logged today, **When** the user views the timeline, **Then** they see an empty state encouraging them to add their first meal

---

### User Story 3 - Add Food Entry (Priority: P3)

As a user, I want to quickly add a food entry so I can track my calorie consumption.

**Why this priority**: This enables data input which makes the tracking system functional. Without this, users cannot populate their dashboard with real data.

**Independent Test**: Can be fully tested by tapping the add food button and observing the interaction flow. Delivers value by enabling food logging.

**Acceptance Scenarios**:

1. **Given** a user wants to log food, **When** they tap the add food button, **Then** a simple inline form appears with name, calories, and optional meal type fields
2. **Given** the add food interface is open, **When** the user views it, **Then** they see food name (required), calorie count (required), and meal type dropdown (optional: Breakfast, Lunch, Dinner, Snack)
3. **Given** a user has entered food details, **When** they confirm the entry, **Then** the meal appears in the timeline and calorie progress updates immediately

---

### Edge Cases

- What happens when the user has logged no meals? Display a friendly empty state with guidance to add first meal
- What happens when the user exceeds their calorie goal? Show an over-limit state without being judgmental (progress bar shows 100%+ with distinct visual treatment)
- What happens when there are many meals in a day? Timeline scrolls to accommodate all entries
- What happens on page refresh? Data persists within the session using mock data (database integration deferred)
- What happens when meal type is not selected? Entry is saved without meal type; timeline displays entry without category label

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a horizontal progress bar showing consumed calories against daily target, with percentage indicator
- **FR-002**: System MUST display remaining calories when under target, or excess calories when over target, alongside the progress bar
- **FR-003**: System MUST show a chronological meal timeline for the current day
- **FR-004**: Each meal entry MUST display: meal name, time consumed, calorie count, and meal type (if provided)
- **FR-005**: System MUST provide a prominently visible "Add Food" button accessible from the dashboard
- **FR-006**: Add food button MUST display a simple inline form with food name (required), calories (required), and optional meal type dropdown (Breakfast, Lunch, Dinner, Snack); submitted entries are added to session mock data
- **FR-007**: System MUST use mock/fake data for all displays (database integration deferred)
- **FR-008**: System MUST bypass authentication requirements (authentication deferred)
- **FR-009**: Dashboard MUST be responsive and work on mobile and desktop viewports
- **FR-010**: System MUST display an encouraging empty state when no meals are logged

### Key Entities

- **Daily Summary**: Represents the user's daily calorie tracking (target calories, consumed calories, date)
- **Meal Entry**: Represents a single food/meal logged by the user (name: string, calories: number, timestamp: Date, mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack')
- **Calorie Target**: The user's daily calorie goal (fixed mock value for now)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their daily calorie progress within 2 seconds of opening the dashboard
- **SC-002**: Users can identify their remaining/excess calories at a glance without scrolling
- **SC-003**: Users can view their complete meal history for the day by scrolling the timeline
- **SC-004**: Users can initiate adding a new food entry with a single tap/click
- **SC-005**: Dashboard displays correctly on viewports from 320px to 1920px width
- **SC-006**: Empty states provide clear guidance for first-time users

## Clarifications

### Session 2025-12-24

- Q: What happens when the user taps the "Add Food" button? → A: Show a simple inline form with name + calories fields, adds to mock data for session
- Q: What visual style should be used for the calorie progress indicator? → A: Horizontal progress bar with percentage
- Q: Should meal entries include a meal type category? → A: Optional meal type dropdown (Breakfast, Lunch, Dinner, Snack)

## Assumptions

- Daily calorie target will use a reasonable mock default (e.g., 2000 calories)
- Mock meal data will include 3-5 sample entries to demonstrate timeline functionality
- The add food button opens a simple inline form with name, calories, and optional meal type
- Authentication and database integration are explicitly out of scope per user requirements
- Focus is on UI/UX quality and intuitive design over feature complexity
