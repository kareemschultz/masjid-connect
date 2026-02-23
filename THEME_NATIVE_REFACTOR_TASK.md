# Comprehensive Theme Refactor (Native CSS Variables)

## Objective
The goal is to replace the "CSS override" hack for light mode with a proper native CSS variable implementation in Tailwind.
**CRITICAL CONSTRAINT: The existing dark mode MUST remain 100% byte-for-byte identical visually.**

## Current State
The app uses hardcoded Tailwind classes for dark mode:
- Backgrounds: `bg-[#0a0b14]`, `bg-gray-900`, `bg-gray-800`
- Text: `text-white`, `text-gray-400`, `text-gray-300`
- Borders: `border-gray-800`, `border-gray-700`
- The light theme is currently applied via brute-force CSS overrides in `app/globals.css` using `html[data-theme='light']`. This looks bad and breaks opacities/gradients.

## Plan

1. **Define CSS Variables in `app/globals.css`**
Create a `:root` block for the light theme and a `.dark` (or `html:not([data-theme='light'])`) block for the default dark theme.
The default dark block MUST map exactly to the current Tailwind hex colors so the dark mode doesn't change at all:
```css
:root {
  --background: #f5f5f0;
  --foreground: #111827;
  --card: #ffffff;
  --card-foreground: #111827;
  --popover: #ffffff;
  --popover-foreground: #111827;
  --primary: #10b981; /* emerald-500 */
  --primary-foreground: #ffffff;
  --muted: #f0ede8;
  --muted-foreground: #6b7280;
  --border: #d8d4cd;
  /* Add gradients and other specific vars */
}

html:not([data-theme='light']) {
  --background: #0a0b14;
  --foreground: #ffffff;
  --card: #111827; /* gray-900 */
  --card-foreground: #ffffff;
  --popover: #1f2937; /* gray-800 */
  --popover-foreground: #ffffff;
  --primary: #10b981;
  --primary-foreground: #ffffff;
  --muted: #374151; /* gray-700 */
  --muted-foreground: #9ca3af; /* gray-400 */
  --border: #1f2937; /* gray-800 */
}
```

2. **Update `tailwind.config.ts` (or `.js` / `.mjs`)**
Map the Tailwind utility classes to these variables (e.g., `colors: { background: "var(--background)", card: "var(--card)", ... }`).

3. **Refactor Components**
Replace hardcoded classes across the app with the new semantic classes:
- `bg-[#0a0b14]` -> `bg-background`
- `bg-gray-900` -> `bg-card`
- `text-white` -> `text-foreground`
- `text-gray-400` -> `text-muted-foreground`
- `border-gray-800` -> `border-border`
- Ensure opacities still work (e.g., `bg-card/50`).

4. **Clean up `globals.css`**
Remove the old `html[data-theme='light']` brute-force override block at the bottom of the file entirely, as it will be replaced by the native CSS variable logic.

## Execution
Please execute this refactor thoughtfully. Start by updating the tailwind config and globals.css, then create a script (e.g., in node or bash) to find and replace the most common hardcoded classes across the `app/` and `components/` directories. Test the build, commit the changes, and notify the user using `openclaw system event`.