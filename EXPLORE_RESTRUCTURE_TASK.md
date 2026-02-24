# Explore Tab Restructure & Buddy System Elevation

## Objective
The Explore tab has become a "link dump" with 39 items across 7 flat categories. We need to restructure it into distinct, visually separated "Hubs" with better naming, elevate the Buddy System to be more accessible, and update the App Tour to reflect these changes.

## Tasks

### 1. Restructure & Rename Explore Hubs (`app/explore/page.tsx`)
Redesign the layout to use larger cards or distinct visual blocks for major hubs, rather than just a massive flat list.
Rename and group the categories:
- **Learning Hub** (formerly Madrasa/Quran/Fiqh): Quran, Fiqh Guide, Hadith, Madrasa, Lectures, Hifz Mode, Prophets, Arabic Practice, GII Library.
- **Practice & Tools**: Duas, Adhkar, Tasbih, Qibla, Zakat, Zakat Calculator, Islamic Calendar, 99 Names, Islamic Names.
- **Community Hub**: Halal Directory, Halal Guide, Masjids, Local Scholars, Janazah Guide, Iftaar Feed, Events.
- **Sisters & New Muslims**: New to Islam, Sisters, Sisters in Ramadan, Kids Corner.

Make the search bar sticky at the top if possible.

### 2. Elevate the Buddy System
- **Home Screen (`app/page.tsx`)**: Add a compact "Buddy Bar" below the main prayer countdown or quick actions. If the user has a buddy (check `lib/storage.ts` or local state), show their streak and a "Nudge" button. If not, show a "Find a Faith Buddy" button linking to `/explore/buddy`.
- **Tracker Tab (`app/tracker/page.tsx`)**: Add a "Buddy Progress" card at the top, showing a side-by-side comparison of daily Salah completion if they have a buddy.

### 3. Update the App Tour (`components/app-tour.tsx`)
The App Tour currently navigates through the old Explore structure.
- Update the `steps` array in `components/app-tour.tsx`.
- Ensure the `target` selectors and `data-tour` attributes match the new hub names and layout in `app/explore/page.tsx`.
- Ensure it still physical navigates to the correct routes.

## Execution
Use your best judgment for the UI layout of the new "Hubs" to make them look premium (e.g., using grid layouts, distinct background tints for each hub section).
Ensure the light/dark mode CSS variables (`bg-card`, `text-foreground`, etc.) are respected.
Commit the changes and run an openclaw system event when complete.