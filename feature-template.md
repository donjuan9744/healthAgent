# Task: Build Feature – [FEATURE NAME]

## Goal
Implement the complete [FEATURE NAME] module, including all components, services, state management, screens, utilities, and integrations required for full functionality. The implementation must follow the app’s architecture, coding standards, and UI design system.

## Scope
Codex should generate all files described in this specification. It may create new directories as needed. All code must be production‑ready, modular, typed, and integrated with existing app systems (auth, Firestore, navigation, UI components).

---

# Requirements

## Functional Requirements
- Describe the core functionality of this feature.
- List all user actions the feature must support.
- List all data inputs and outputs.
- Describe any Firestore reads/writes.
- Describe any interactions with other modules.

## Non‑Functional Requirements
- Performance expectations.
- Security considerations.
- Accessibility requirements.
- UI/UX constraints.
- Offline behavior (if applicable).

---

# File Structure
Codex should generate or update the following structure:

/src
/[feature-folder]
[featureService].ts
[featureStore].ts
[FeatureScreen].tsx
/components
[FeatureComponent1].tsx
[FeatureComponent2].tsx
/utils
[featureUtils].ts


Codex may add additional files if needed for clean architecture.

---

# Implementation Details

## Data Model
- Define the Firestore document structure.
- Define TypeScript interfaces.
- Define validation rules.

## Business Logic
- Describe how the feature works step‑by‑step.
- Describe any calculations, transformations, or workflows.
- Describe how this feature interacts with user data.

## UI Requirements
- Describe the layout.
- Describe the components needed.
- Describe animations or transitions.
- Describe color usage and styling rules.

## Navigation
- Define how users reach this feature.
- Define where they go after completing actions.

---

# User Stories

### 1. [User Story Title]
As a [user type], I want to [action], so that I can [outcome].

### 2. [User Story Title]
As a [user type], I want to [action], so that I can [outcome].

(Add more as needed.)

---

# Acceptance Criteria
Codex should produce:
- All files listed in the file structure.
- Fully typed, modular code.
- Working UI components.
- Working Firestore integration.
- Navigation wired into the app.
- Error handling and loading states.
- Clean, responsive UI matching the design system.
- Any placeholder assets needed.

---

# Deliverables
Codex should generate:
- Components
- Screens
- Services
- State stores
- Utilities
- Firestore integration
- Navigation updates
- Styling

Codex may create additional files if needed for clean architecture.
