# Noorani Qaida — Audio Enhancement

## Goal
Add audio pronunciation to the Noorani Qaida page (`app/explore/madrasa/qaida/page.tsx`) using the **Web Speech API** (built into iOS/Android browsers). No audio files needed — uses the device's native Arabic TTS voice.

## Why Web Speech API
- Built into Safari (iOS), Chrome (Android), all modern browsers
- Supports Arabic (`ar-SA`) natively  
- Works offline, zero hosting cost
- No API keys or CDN dependencies

---

## Part 1 — Create `lib/arabic-speech.ts` utility

```typescript
// lib/arabic-speech.ts
// Utility for Arabic TTS via Web Speech API

export function speakArabic(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

  // Cancel any currently speaking
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ar-SA'
  utterance.rate = 0.75   // slower for learning
  utterance.pitch = 1.0

  // Prefer Arabic voice if available
  const voices = window.speechSynthesis.getVoices()
  const arabicVoice = voices.find(v => v.lang.startsWith('ar'))
  if (arabicVoice) utterance.voice = arabicVoice

  if (onEnd) utterance.onend = onEnd
  window.speechSynthesis.speak(utterance)
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}
```

---

## Part 2 — Add audio to `app/explore/madrasa/qaida/page.tsx`

### 2a. Imports to add
```typescript
import { Volume2, VolumeX } from 'lucide-react'
import { speakArabic, stopSpeech, isSpeechSupported } from '@/lib/arabic-speech'
```

### 2b. State to add in `QaidaPage` component
```typescript
const [speaking, setSpeaking] = useState<string | null>(null)
const [speechSupported, setSpeechSupported] = useState(false)

useEffect(() => {
  setSpeechSupported(isSpeechSupported())
  // Load voices (required on some browsers)
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      setSpeechSupported(true)
    })
  }
}, [])
```

### 2c. Helper function
```typescript
const playArabic = (text: string, id: string) => {
  if (speaking === id) {
    stopSpeech()
    setSpeaking(null)
    return
  }
  setSpeaking(id)
  speakArabic(text, () => setSpeaking(null))
}
```

### 2d. Speaker button component (inline)
```typescript
const SpeakerBtn = ({ text, id }: { text: string; id: string }) => {
  if (!speechSupported) return null
  const isPlaying = speaking === id
  return (
    <button
      onClick={(e) => { e.stopPropagation(); playArabic(text, id) }}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
        isPlaying
          ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
          : 'bg-gray-800 text-gray-400 active:bg-gray-700 active:text-white'
      }`}
      aria-label={isPlaying ? 'Stop' : 'Play pronunciation'}
    >
      <Volume2 className="h-4 w-4" />
    </button>
  )
}
```

---

## Part 3 — Where to add SpeakerBtn in the UI

Read the full file carefully to understand the current UI structure, then add speakers in these locations:

### 3a. Alphabet letter cards (main lesson list view)
In the grid of letter cards (where `lesson.type === 'alphabet'`), each letter card shows the Arabic character. Add a `<SpeakerBtn>` to each card:
- `text`: the letter's `arabic` character (e.g. `ب`)
- `id`: `letter-${item.name}` (e.g. `letter-Ba`)

### 3b. Letter detail sheet (when `selectedLetter` is set)
The letter detail sheet shows the selected letter large with its name. Add a prominent speaker button near the large Arabic display:
- `text`: `selectedLetter.arabic`
- `id`: `detail-${selectedLetter.name}`

Also add a "Hear name" button that speaks the letter's full Arabic name (not just the character):
- Some letters have a spoken name different from their written form — use the `name` field (e.g. "باء" for baa)

### 3c. Letter forms section
If the letter detail sheet shows initial/medial/final forms, add a speaker for each form:
- `text`: the form string
- `id`: `form-${selectedLetter.name}-${formType}`

### 3d. Harakat sections
For `type === 'harakat'` or `type === 'maddah'` lessons, each `HarakatSection` has `examples: HarakatExample[]` where each example has an `arabic` string. Add a `<SpeakerBtn>` next to each example:
- `text`: `example.arabic`
- `id`: `harakat-${sectionIdx}-${exampleIdx}`

### 3e. "Play All" button for alphabet lesson
When viewing the alphabet lesson (lesson 1), add a "Play All Letters" button at the top:
```typescript
const playAllLetters = async (letters: AlphabetContent[]) => {
  let i = 0
  const playNext = () => {
    if (i >= letters.length) { setSpeaking(null); return }
    const letter = letters[i++]
    setSpeaking(`letter-${letter.name}`)
    speakArabic(letter.arabic, () => {
      setTimeout(playNext, 600) // 600ms gap between letters
    })
  }
  playNext()
}
```
Add a button: `"▶ Play All"` in emerald — only show when `lesson.type === 'alphabet'`.

---

## Part 4 — Also add to harakat/maddah compound examples

For `CompoundContent` type lessons, each item has an `arabic` field. Add speaker:
- `text`: `item.arabic`
- `id`: `compound-${idx}`

---

## Part 5 — "No audio" graceful degradation

If `speechSupported` is false (old browser, or user hasn't granted permission), show a small notice in the lesson sheet:
```tsx
{!speechSupported && (
  <div className="mx-4 mb-3 rounded-xl border border-gray-800 bg-gray-900/50 p-3 text-center">
    <p className="text-xs text-gray-500">Audio not supported on this device</p>
  </div>
)}
```

---

## Part 6 — Build and Deploy

```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . -q && \
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && \
docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && \
docker network connect kt-net-apps kt-masjidconnect-prod && \
docker network connect kt-net-databases kt-masjidconnect-prod
```

Verify:
```bash
docker ps | grep kt-masjidconnect-prod
curl -s -o /dev/null -w "%{http_code}" https://masjidconnectgy.com
```

When completely finished, run:
openclaw system event --text "Done: Noorani Qaida audio added — speaker buttons on every letter card, letter detail sheet, harakat examples, Play All function for alphabet lesson. Uses Web Speech API (device native Arabic TTS, no files needed)." --mode now
