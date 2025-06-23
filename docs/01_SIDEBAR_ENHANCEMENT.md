# Sidebar Visual and Functional Enhancement

## Overview
This document details the requirements and steps for enhancing the main application sidebar, both visually and functionally, to improve user experience and maintain design consistency.

## Goals
- Remove the sidebar's semi-transparent white background to allow the app's background image to be fully visible.
- Update the collapse functionality so that when collapsed, the sidebar is completely hidden (not just narrowed).
- Add a new button to open the collapsed sidebar.
- Ensure all changes are smooth and maintainable.

## File Locations
- `src/navigation/MainTabNavigator.tsx` (main sidebar logic and rendering)
- `src/components/AppBackground.tsx` (background image logic)

## Implementation Details
### 1. Remove Sidebar Background
- Locate the style responsible for the sidebar's background color in `MainTabNavigator.tsx`.
- Remove or update the background property so that the sidebar is fully transparent, allowing the background image from `AppBackground.tsx` to show through.

### 2. Update Collapse Functionality
- Refactor the collapse logic so that when the sidebar is collapsed, it is not visible (width set to 0 or component hidden), rather than just reducing width to 50px.
- Ensure the `toggleNavCollapse` function and the `navPanelWidth` animated value reflect this new behavior.

### 3. Add Open Sidebar Button
- Implement a new button that appears when the sidebar is collapsed.
- This button should be positioned accessibly and trigger the sidebar to expand when clicked.
- Ensure the button is styled consistently with the app's design.

### 4. Testing
- Test sidebar open/close behavior on all supported devices and screen sizes.
- Confirm that the background image is visible through the sidebar area at all times.

## Dependencies
- No new dependencies are required, but ensure that any style or animation libraries used are up to date.

## Notes
- Coordinate with design guidelines in `src/constants/theme.ts` if needed.
- Review `AppBackground.tsx` to ensure no conflicts with the sidebar changes.
