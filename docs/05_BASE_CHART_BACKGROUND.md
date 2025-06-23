# Base Chart Page Background

## Overview
This document describes the steps to remove the background color from the 'Base Chart' page so that the app's background image is visible, as intended.

## Goals
- Remove any background color or overlay that obscures the background image on the 'Base Chart' page.
- Ensure the background image from `AppBackground.tsx` is fully visible.

## File Locations
- `src/screens/Main/UserBaseChartScreen.tsx` (Base Chart screen)
- `src/components/AppBackground.tsx` (background image logic)

## Implementation Details
### 1. Identify and Remove Background Color
- In `UserBaseChartScreen.tsx`, locate any style or view that sets a background color covering the background image.
- Remove or update the style to ensure the background image is visible.

### 2. Test Appearance
- Render the page and verify that the background image from `AppBackground.tsx` is visible and unobstructed.

## Dependencies
- No new dependencies required.

## Notes
- Coordinate with design guidelines in `src/constants/theme.ts` if needed.
- Test on multiple devices and screen sizes for consistent appearance.
