# Aspect Ratio of Custom Rectangular Buttons

## Overview
This document describes the required changes to ensure the custom `StackedButton` component renders as a rectangle, not a square, by adjusting the aspect ratio of its `rectLayers` styles.

## Goals
- Update the `rectLayers` style definitions to enforce a rectangular (not square) appearance for the button.
- Ensure the button's width-to-height ratio matches design specifications.

## File Location
- `src/components/StackedButton.tsx`

## Implementation Details
### 1. Update Style Definitions
- In `StackedButton.tsx`, locate the style definitions for `rectLayers`.
- Adjust the width and height properties to achieve a rectangular aspect ratio (e.g., width: 200, height: 60, or as per design requirements).
- Ensure the `shape="rectangle"` prop is respected in the style logic.

### 2. Test Appearance
- Render the button in the app and verify it appears as a rectangle on all devices and screen sizes.
- Adjust styles as needed for responsiveness.

## Dependencies
- No new dependencies required.

## Notes
- Coordinate with design guidelines in `src/constants/theme.ts` if needed.
- Test with all button usages to ensure consistent appearance.
