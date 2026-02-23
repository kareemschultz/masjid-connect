// lib/arabic-speech.ts
// Utility for Arabic TTS via Web Speech API

export function speakArabic(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

  // Cancel any currently speaking
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ar-SA'
  utterance.rate = 0.75 // slower for learning
  utterance.pitch = 1.0

  // Prefer Arabic voice if available
  const voices = window.speechSynthesis.getVoices()
  const arabicVoice = voices.find((v) => v.lang.startsWith('ar'))
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
