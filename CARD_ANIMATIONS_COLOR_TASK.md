# Card Animations Color Enhancement

## Objective
Enhance the card background animations in the Explore tab to be more colorful, vibrant, and thematically relevant. Currently, animations use `currentColor` (grayscale) and some cards use generic "default" animations.

## Requirements

### 1. Add Colors to Existing Animations
Replace `currentColor` with specific themed colors for each animation:
- **Quran**: Purple/violet tones (`#9333ea`, `#a855f7`)
- **Fiqh**: Amber/gold tones (`#f59e0b`, `#fbbf24`)
- **Hadith**: Teal/cyan tones (`#14b8a6`, `#06b6d4`)
- **Madrasa**: Indigo tones (`#6366f1`, `#818cf8`)
- **Lectures**: Emerald tones (`#10b981`, `#34d399`)
- **Hifz**: Blue tones (`#3b82f6`, `#60a5fa`)
- **Prophets**: Amber/gold stars (`#f59e0b`, `#fbbf24`)
- **Arabic**: Cyan tones (`#06b6d4`, `#22d3ee`)
- **Duas**: Purple/pink tones (`#a855f7`, `#d946ef`)
- **Tasbih**: Emerald beads (`#10b981`, `#34d399`)
- **Qibla**: Blue compass (`#3b82f6`, `#60a5fa`)
- **Community**: Violet/purple people (`#8b5cf6`, `#a78bfa`)
- **Halal**: Emerald checkmark (`#10b981`, `#34d399`)
- **Sisters**: Rose/pink petals (`#f43f5e`, `#fb7185`)
- **Kids**: Multiple bright colors (yellow, blue, red)
- **Ramadan**: Gold/amber crescent (`#f59e0b`, `#fbbf24`)

### 2. Create New Themed Animations
Replace "default" with specific animations for:

**Zakat** (theme: 'zakat'):
- Animated coins/currency symbols floating upward
- Colors: Green/teal (`#10b981`, `#14b8a6`)
- Represents wealth flowing for charity

**Calendar** (theme: 'calendar'):
- Crescent moon phases cycling
- Colors: Amber/orange (`#f59e0b`, `#fb923c`)
- Represents Hijri calendar

**Jumuah** (theme: 'jumuah'):
- Rays of light emanating from center (like sunrise)
- Colors: Emerald/teal (`#10b981`, `#14b8a6`)
- Represents Friday's blessed light

**Names** (theme: 'names'):
- Particles forming Arabic calligraphy
- Colors: Amber/gold (`#f59e0b`, `#fbbf24`)
- Represents the beautiful names

**Resources** (theme: 'resources'):
- Books/scrolls appearing and opening
- Colors: Sky blue (`#0ea5e9`, `#38bdf8`)
- Represents knowledge library

### 3. Increase Opacity
Change opacity from `0.03-0.08` to `0.08-0.15` to make colors more visible while maintaining subtlety.

### 4. Add Gradient Effects
Use SVG gradients where appropriate (e.g., `<linearGradient>`, `<radialGradient>`) to make animations richer.

## Alternative Enhancement: Card Gradient Backgrounds
If animations alone don't provide enough visual pop, also enhance the card gradients themselves in `app/explore/page.tsx`:
- Increase gradient opacity from `/20` to `/30` or `/40` (e.g., `from-purple-500/20` → `from-purple-500/40`)
- Add subtle border glows using `ring-1 ring-{color}/20` to make cards stand out more
- Consider adding a subtle `shadow-lg shadow-{color}/20` for depth

## Technical Constraints
- Keep animations CSS-only (no JavaScript)
- Use GPU-accelerated properties (`transform`, `opacity`)
- Animation durations: 4-20 seconds for smooth, calming effects
- Ensure light/dark mode compatibility (colors should work on dark backgrounds)
- If needed, enhance card gradients as a fallback to ensure visual impact

## Files to Update
1. `components/card-animations.tsx` — Add colors, create new animation functions
2. `app/explore/page.tsx` — Update animationTheme from 'default' to specific themes (zakat, calendar, jumuah, names, resources)

## Execution
Implement the colorful animations, update the explore page card themes, commit changes, and run openclaw system event to notify completion.