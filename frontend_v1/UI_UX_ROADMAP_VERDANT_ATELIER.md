# UI/UX Roadmap — Verdant Atelier 2.0

This document maps the new Stitch design system output to concrete frontend implementation tasks.

## Stitch Project & Design System

- Project: `projects/13205147022339675071` (Chef Culinary Marketplace)
- Design system applied: `assets/bf1b8d30838440d1a7ce8afad0df9f70` (Verdant Atelier)
- Key generated reference screens:
  - Landing Page (Glass Edition)
  - Job Discovery
  - Recruiter Dashboard
  - Chef Profile (Glass Edition)

## What was standardized in code already

- Token palette and typography updated in `tailwind.config.js`
- Global CSS tokens + shimmer utility aligned in `src/index.css`
- Primary UI primitives improved:
  - `src/components/ui/button.jsx`
  - `src/components/ui/card.jsx`
- Skeleton visual language aligned to real surfaces via shimmer:
  - `src/components/ui/custom/skeletons/Skeletons.jsx`
  - `ApplicationsSkeleton.jsx`
  - `JobDetailSkeleton.jsx`
  - `ProfileSkeleton.jsx`

## Remaining implementation plan (high priority)

### 1) Navigation consistency
- Unify active/hover/focus behavior between:
  - `ChefNavbar.jsx`
  - `ChefSidebar.jsx`
  - `Sidebar.jsx`

### 2) Card architecture unification
- Refactor card structures to one consistent rhythm in:
  - `JobCardNewDesign.jsx`
  - `ApplicantDetail.jsx`
  - `ApplicationCard.jsx`
  - `RecruiterHome.jsx`
  - `JobManagement.jsx`

### 3) Form shell standardization
- Align all forms to one shell and state model:
  - `profile-form.jsx`
  - `CompanyProfileForm.jsx`
  - `PostJobs.jsx`
  - `ProfileEdit.jsx`

### 4) Async state parity
- Ensure every async page has accurate state trio:
  - skeleton
  - empty state
  - error state
- Target pages:
  - `JobSeekerHome.jsx`
  - `RecruiterHome.jsx`
  - `Applications.jsx`
  - `ApplicantDetail.jsx`
  - `Profile.jsx`
  - `Messages.jsx`

### 5) Icon and microcopy refinement
- Keep icon family/stroke consistent in all primary pages
- Replace ambiguous CTA labels with action-first language

## Completion criteria

- Visual consistency across all cards/buttons/forms/navigation
- No screen without matching skeleton + empty + error treatment
- Shared tokens used, no one-off colors/radii/shadows
- Build passes after each phase
