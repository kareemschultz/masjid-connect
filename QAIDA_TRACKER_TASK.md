# Task: Add Noorani Qaida Tracking to the Ibadah Tracker

## Context
App: MasjidConnect GY (Next.js 15, Tailwind, React)
Path: `/home/karetech/v0-masjid-connect-gy/`
Current Tracker: `app/tracker/page.tsx`

## Requirement
The user requested a dedicated "Qaida Progress" module on the main Tracker tab so beginners can log their daily lesson progress. 
We already have the Noorani Qaida learning module under the Madrasa section (`app/explore/madrasa/qaida/page.tsx`), which consists of 17 lessons.

## What needs to be done
1. **State & Storage**: 
   - Add a state variable for Qaida tracking in `app/tracker/page.tsx`, similar to `quranLog` or `fastingLog`.
   - Update `lib/storage.ts` to include a new key `KEYS.QAIDA_LOG = 'qaida_log'`.
   - The log should track which lesson the user practiced today (e.g., `{ [date]: { lesson: number, duration: number } }` or simply `{ [date]: boolean }` or whatever fits best with the existing tracker patterns). Let's go with a simple daily completion toggle, or a "Lessons practiced today" counter, or a dropdown to select the lesson number (1-17). Let's use a simple dropdown/selector for the lesson number (1-17) and a "Mark Complete" button for the day.

2. **UI Component in `app/tracker/page.tsx`**:
   - Add a new collapsible section in the Tracker (similar to "Quran Reading" or "Adhkar").
   - Title: "Noorani Qaida Practice"
   - Icon: Book (or similar)
   - Accent color: Purple or Teal
   - UI should allow the user to select which Lesson (1-17) they practiced today, and check it off.
   - Show a link/button "Go to Qaida Lesson" that routes to `/explore/madrasa/qaida`.
   - Add points logic: e.g., +10 points for practicing Qaida. Update `points-client.ts` if necessary, or just handle it inline like other tracker items.

3. **Checklist & Points**:
   - Add Qaida to the Daily Checklist if appropriate, or just keep it as an optional tracker section.
   - Ensure it visually matches the existing dark theme/glass morphism design of the tracker.

Please implement these changes, ensuring no existing tracker functionality is broken. When finished, commit the changes and use the OpenClaw system event command to notify completion.