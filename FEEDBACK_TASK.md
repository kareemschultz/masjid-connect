# Task: Address User Feedback

## Context
App: MasjidConnect GY
Repo: `/home/karetech/v0-masjid-connect-gy/`

## Feedback to Address

1.  **Reciter Selection Bug:** "I selected husary and he said the Bismillah but the rest of the ayah are mishary recitation."
    -   Investigate and fix the audio playback logic in the Quran reader. The reciter selection needs to be applied consistently to all ayahs, not just the Bismillah.

2.  **Audio Repeat Feature:** "Do you think a 'repeat 10 times' for the audio would be helpful in memorization? Or perhaps it could be a later update after launch."
    -   Evaluate adding a repeat option (e.g., 10x) to the audio player for memorization purposes.

3.  **Tasbih Counter Increment:** "Instead of +2,+4....just put +2 since we pray in 2s anyways."
    -   Adjust the increment logic or UI for the Tasbih/counter feature based on this feedback.

## Implementation Steps
1.  Review the Quran reader audio component (`app/quran/[surah]/page.tsx` or related audio player component).
2.  Fix the reciter state handling so the selected reciter is used for the entire surah playback.
3.  Add or adjust the repeat functionality.
4.  Modify the Tasbih increment UI.
5.  Commit changes and rebuild the container.
