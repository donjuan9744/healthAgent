# Task: Build the Fitness Application (MVP)

## Goal
Create the full MVP implementation of a personalized fitness application. The system must generate custom fitness plans, track user progress, motivate users with gamified elements, and provide a clean, responsive UI. The app must use Firebase Authentication and Firestore.

## Scope
Codex should generate all required files, components, services, utilities, and data models described in this specification. It may create new directories as needed. All code must be production‑ready, modular, and follow best practices.

---

# Requirements

## Functional Requirements
- User authentication and login using Firebase Authentication.
- Cloud database for user profiles using Firebase Firestore.
- Onboarding questionnaire (age, weight, goals, equipment, schedule).
- Custom plan generator (workouts + nutrition) with detailed descriptions and images.
- Progress dashboard (stats, streaks, milestones).
- Motivation engine (badges, reminders, celebrations).
- Analytics & reports (weekly summaries, trends).
- Responsive mobile‑first UI.

## Non‑Functional Requirements
- Scalable architecture.
- Secure data handling and encrypted storage.
- Fast performance with offline caching.
- Clean, modern UI with smooth animations.
- Accessibility compliance (WCAG 2.1 AA).

---

# File Structure
Codex should generate or update the following structure:


/src
/auth
authService.ts
useAuth.ts
/components
/onboarding
/dashboard
/workouts
/nutrition
/motivation
/data
workoutLibrary.ts
nutritionLibrary.ts
/hooks
/layouts
/screens
OnboardingScreen.tsx
DashboardScreen.tsx
WorkoutScreen.tsx
NutritionScreen.tsx
MotivationScreen.tsx
ProfileScreen.tsx
/services
planGenerator.ts
analyticsService.ts
progressService.ts
motivationService.ts
/state
userStore.ts
planStore.ts
progressStore.ts
/styles
/utils
firebase.ts
app.tsx


Codex may add additional files if needed for clean architecture.

---

# Implementation Details

## Onboarding Module
- Collect age, weight, goals, equipment, schedule.
- Validate inputs.
- Store onboarding data in Firestore.
- Trigger plan generation after completion.

## Custom Plan Generator
- Generate personalized workout + nutrition plans.
- Use workoutLibrary and nutritionLibrary.
- Include:
  - movement descriptions  
  - targeted muscle groups  
  - placeholder image URLs  
- Store generated plans in Firestore.

## Progress Dashboard
- Display:
  - workout logs  
  - nutrition logs  
  - streaks  
  - milestones  
  - weekly summaries  
  - trend charts  
- Pull data from Firestore and local cache.

## Motivation Engine
- Award badges based on milestones.
- Send reminders (local notifications).
- Trigger celebrations (UI animations, confetti, etc.).

## Analytics & Reports
- Weekly summaries.
- Trend analysis.
- User engagement metrics.

## UI Design Requirements
- Modern, slick, classy, simple.
- Minimalist layout with whitespace.
- Smooth transitions and subtle animations.
- Elegant typography.
- Responsive design for all devices.
- Color palette:
  - fresh greens  
  - soft blues  
  - energetic accents (orange/yellow)  
  - teal + lime + white + gray  

---

# User Stories

### 1. New User Onboarding
As a beginner, I want to complete an onboarding questionnaire so the app can generate a personalized plan.

### 2. Following a Custom Plan
As an intermediate user, I want to view and follow my daily workout and nutrition plan.

### 3. Tracking Progress
As a busy professional, I want to log workouts and see my progress dashboard.

### 4. Motivation and Engagement
As a user who loses motivation, I want badges, reminders, and celebrations.

### 5. Account Management
As a registered user, I want to securely log in and manage my profile.

---

# Performance Metrics
- 30‑day retention
- DAU/WAU
- Free → paid conversion
- Session duration
- Engagement with motivation features
- User satisfaction scores

---

# Accessibility Requirements
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode
- Adjustable font sizes

---

# Privacy & Compliance
- GDPR compliance
- Clear consent flows
- Encrypted storage
- In‑app privacy policy

---

# Integrations
- Firebase Authentication
- Firebase Firestore
- Future: Fitbit, Apple Health
- Social sharing

---

# Error Handling
- Friendly error messages
- Retry logic for network failures
- In‑app support
- FAQ/help section

---

# Localization
- English first
- Framework for additional languages
- Locale‑aware units, dates, times

---

# Monetization
- Freemium model
- Monthly + annual subscriptions
- In‑app purchases
- Affiliate partnerships

---

# Security
- Encrypted data
- Secure auth flows
- Token expiration
- Protection against XSS/CSRF

---

# Scalability & Maintenance
- Firebase‑based scaling
- Modular codebase
- Regular maintenance
- Monitoring + alerts

---

# Acceptance Criteria
Codex should produce:
- A complete, runnable project structure.
- All modules, components, services, and screens listed above.
- Firebase integration working end‑to‑end.
- Onboarding → plan generation → dashboard flow functional.
- Clean, responsive UI matching the design requirements.
- Placeholder images where needed.
- Fully typed code (TypeScript).
- Modular, maintainable architecture.

---

# Deliverables
Codex should generate:
- All code files
- All components
- All services
- All screens
- All state stores
- All utilities
- Firebase setup
- Routing/navigation
- UI layout and styling

Codex may create additional files if needed for clean architecture.
