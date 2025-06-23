# Button Standardization on Frequency Mapper and Base Chart Screens

## Overview
This document outlines the process for standardizing button components on the 'Frequency Mapper' and 'Base Chart' screens to use the custom `StackedButton` component, ensuring a consistent user interface.

## Goals
- Replace all buttons on the specified screens with the custom `<StackedButton shape="rectangle" ... />` component.
- Ensure the new buttons match the app's design and functionality requirements.

## File Locations
- `src/components/StackedButton.tsx` (custom button component)
- `src/screens/Main/FrequencyMapperScreen.tsx` (Frequency Mapper screen)
- `src/screens/Main/UserBaseChartScreen.tsx` (Base Chart screen)

## Implementation Details
### 1. Frequency Mapper Screen
- In `FrequencyMapperScreen.tsx`, identify all button elements.
- Replace each with the `StackedButton` component, using the `shape="rectangle"` prop and passing all necessary props (e.g., `onPress`, `title`, etc.).
- Remove any unused button imports.

### 2. Base Chart Screen
- In `UserBaseChartScreen.tsx`, locate the 'SHOW VISUALIZATION' and 'REFRESH DATA' buttons.
- Replace these with the rectangular `StackedButton` component, ensuring all props and event handlers are correctly passed.

### 3. Consistency and Styling
- Ensure all new buttons are styled consistently and align with the app's theme.
- Test button functionality and appearance on both screens.

## Dependencies
- No new dependencies required, but ensure `StackedButton.tsx` is up to date and supports all needed props.

## Notes
- Coordinate with design guidelines in `src/constants/theme.ts` if needed.
- Test on multiple devices for consistent appearance and behavior.
