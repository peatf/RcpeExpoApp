# Chart Visualization Text Styling

## Overview
This document outlines the process for updating the text styling beneath the chart visualization on the 'User Base Chart' screen to align with the application's design guidelines.

## Goals
- Update the styles of the text rendered by `BlueprintDescription.tsx` to match the app's theme.
- Ensure the text is visually consistent and accessible.

## File Locations
- `src/screens/Main/UserBaseChartScreen.tsx` (Base Chart screen)
- `src/components/EnergeticBlueprint/BlueprintDescription.tsx` (description text component)
- `src/constants/theme.ts` (theme and style definitions)
- `src/components/EnergeticBlueprint/BlueprintCanvas.tsx` (chart rendering, for context)

## Implementation Details
### 1. Update Text Styles
- In `BlueprintDescription.tsx`, locate the style definitions for the description text.
- Update font size, color, weight, and spacing to match values from `src/constants/theme.ts`.
- Ensure the text is readable and visually appealing.

### 2. Test Appearance
- Render the updated component in the app and verify the text matches the design guidelines.
- Test on multiple devices and screen sizes for consistency.

## Dependencies
- No new dependencies required.

## Notes
- Coordinate with design guidelines in `src/constants/theme.ts`.
- Review related components for consistency.
