# Settings Tab Restructure

## Objective
The Settings tab (`app/settings/page.tsx`) has grown quite long. To avoid overwhelming the user, we should group related settings under expandable/collapsible accordions or modals, rather than having a massive flat list of setting rows.

## Tasks
1. **Refactor `app/settings/page.tsx`** to group related settings into collapsible sections. For example:
   - **Account & Profile**: Sign in/out, Username, Phone number.
   - **Prayer & Location**: Calculation Method, Asr Madhab, Moon Sighting, Prayer Time Adjustments, Location.
   - **Quran Preferences**: Reciter, Translation, Arabic Font.
   - **Notifications**: Push toggles, specific prayer alerts.
   - **App Preferences**: Theme, Language.

2. You can use an accordion component or simply manage local state (e.g., `expandedSection`) to show/hide the contents of each `SettingGroup`. The `SettingGroup` component itself could be modified to accept an `isCollapsible` and `isExpanded` prop, with a caret icon to toggle it.

## Execution
- Ensure the UI remains premium and respects the light/dark mode CSS variables.
- Commit the changes and run an openclaw system event when complete.