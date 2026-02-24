# Explore Card Background Animations

## Objective
Add subtle, thematic CSS-only background animations to the feature cards in the Explore tab, similar to the hero animations already implemented. Each card should have a unique animation that reflects its purpose.

## Tasks

### 1. Create Card Animation Component
Create a new component `components/card-animations.tsx` that provides different animation variants for each type of card.

**Animation Themes:**
- **Quran**: Floating Arabic calligraphy strokes or book page turn effect
- **Fiqh Guide**: Animated scales balancing, justice theme
- **Hadith**: Subtle scroll unfurling or manuscript theme
- **Madrasa**: Floating knowledge symbols (lightbulbs, graduation caps)
- **Lectures**: Audio waveform pulses
- **Hifz Mode**: Brain neurons connecting, memory theme
- **Prophets**: Star constellation patterns
- **Arabic Practice**: Letters floating and forming words
- **Duas**: Prayer hands radiating light
- **Tasbih**: Counter beads rotating in a circle
- **Qibla**: Compass needle subtle rotation
- **Community**: Connected people silhouettes
- **Halal**: Checkmark approval animation
- **Sisters**: Flower petals floating
- **Kids**: Playful stars and shapes bouncing
- **Default**: Gentle gradient shift

### 2. Technical Requirements
- **CSS-only animations** (no JavaScript, no external libraries)
- Use `transform` and `opacity` for GPU-acceleration
- Keep animations subtle (2-5% opacity, slow speeds)
- Animations should be `infinite` loops
- Use SVG shapes with CSS animations, similar to `hero-animations.tsx`

### 3. Integration
- Update `app/explore/page.tsx` to add the animation component to each card
- Each Link card should have a `<CardAnimation theme={...} />` component positioned absolutely behind the content
- Ensure the animation doesn't interfere with card clickability or text readability

### 4. Example Structure (follow hero-animations.tsx pattern)
```tsx
export type CardAnimationTheme = 
  | 'quran' | 'fiqh' | 'hadith' | 'madrasa' | 'lectures' 
  | 'hifz' | 'prophets' | 'arabic' | 'duas' | 'tasbih' 
  | 'qibla' | 'community' | 'halal' | 'sisters' | 'kids' | 'default'

interface CardAnimationProps {
  theme?: CardAnimationTheme
}

export function CardAnimation({ theme = 'default' }: CardAnimationProps) {
  // Return SVG animation based on theme
}
```

### 5. Styling Constraints
- Animations must respect light/dark mode (use CSS variables)
- z-index should be `-10` so they stay behind text
- Opacity should be very low (0.03-0.08) to remain subtle
- Animation durations: 10-20 seconds for slow, calming effect

## Execution
Implement the animations, integrate into the Explore cards, commit the changes, and run openclaw system event to notify completion.