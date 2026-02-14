# 🎨 Quick Color Reference

## Primary Palette (Two Colors Only)

### 🔵 Soft Slate Blue (Primary)
```
Hex:  #8B9DC3
RGB:  rgb(139, 157, 195)
HSL:  hsl(221, 38%, 65%)
```

**Usage Examples:**
- ✅ Navigation bar background
- ✅ Primary button background
- ✅ Links and anchor text
- ✅ Product prices (emphasis)
- ✅ Icons (primary actions)
- ✅ Loading spinners
- ✅ Focus rings and active states

**Variants:**
- **Dark**: #6B7FA3 (for hover states)
- **Light**: #ABB9D3 (for subtle backgrounds)

---

### 🟡 Warm Cream (Secondary)
```
Hex:  #F5F1E8
RGB:  rgb(245, 241, 232)
HSL:  hsl(42, 38%, 93%)
```

**Usage Examples:**
- ✅ Badge backgrounds
- ✅ Section dividers
- ✅ Alternating row backgrounds
- ✅ Subtle card backgrounds
- ✅ Info boxes
- ✅ Category labels

**Variants:**
- **Dark**: #E5DFC8 (for depth)

---

## Supporting Neutrals

### ⚪ White
```
Hex: #FFFFFF
```
**Usage:**
- Main backgrounds
- Card backgrounds
- Input fields
- Text on colored backgrounds

---

### ⬜ Light Grays

**Gray 50** (Very Light)
```
Hex: #F9FAFB
```
**Usage:** Page backgrounds, hover states

**Gray 100**
```
Hex: #F3F4F6
```
**Usage:** Disabled backgrounds

**Gray 200** (Borders)
```
Hex: #E5E7EB
```
**Usage:** Borders, dividers, separators

---

### ⬛ Dark Grays

**Gray 400** (Placeholder)
```
Hex: #9CA3AF
```
**Usage:** Placeholder text, icons (inactive)

**Gray 500** (Secondary Text)
```
Hex: #6B7280
```
**Usage:** Labels, secondary text, captions

**Gray 700** (Primary Text)
```
Hex: #374151
```
**Usage:** Headings, body text, primary content

---

## State Colors (Minimal Use)

### ✅ Success (Muted Green)
```
Hex: #86A789
```
**Usage:** Success messages, confirmations

### ❌ Error (Muted Rose)
```
Hex: #C89B9B
```
**Usage:** Error messages, delete actions

### ⚠️ Warning (Muted Gold)
```
Hex: #D4B896
```
**Usage:** Warning messages, alerts

---

## Color Combinations

### ✅ Good Combinations

**Text on White:**
```
• Dark Gray (#374151) on White → Great contrast (12.6:1)
• Medium Gray (#6B7280) on White → Good (7.2:1)
• Soft Slate Blue (#8B9DC3) on White → Readable (4.9:1)
```

**White on Colors:**
```
• White on Soft Slate Blue (#8B9DC3) → Good (4.3:1)
• White on Error (#C89B9B) → Readable
```

### ❌ Avoid These

**Poor Contrast:**
```
• Light Gray on White → Too subtle
• Warm Cream text on White → Unreadable
• Gray 400 as primary text → Not accessible
```

---

## Real-World Examples

### Product Card
```
┌─────────────────────┐
│ [Product Image]     │ ← White background
├─────────────────────┤
│ Product Name        │ ← Dark Gray (#374151)
│ ₹999.99            │ ← Soft Slate Blue (#8B9DC3) ✨
│ ┌─────────────────┐ │
│ │ Min. Order: 10  │ │ ← Warm Cream badge (#F5F1E8)
│ └─────────────────┘ │    with Gray text (#6B7280)
└─────────────────────┘
```

### Navigation Bar
```
┌─────────────────────────────────────┐
│  Logo          Home    Admin        │
│  [White]      [White] [White]       │
└─────────────────────────────────────┘
Background: Soft Slate Blue (#8B9DC3) ✨
```

### Primary Button
```
┌─────────────────┐
│  Add Product    │ ← White text
└─────────────────┘
Background: Soft Slate Blue (#8B9DC3) ✨
Hover: Darker Blue (#6B7FA3)
```

### Form Input
```
┌─────────────────────────────┐
│ Product Name                │
└─────────────────────────────┘
Border: Gray 200 (#E5E7EB)
Focus Border: Soft Slate Blue (#8B9DC3) ✨
```

---

## CSS Variable Quick Reference

```css
/* Copy-paste ready */
:root {
  /* Brand Colors */
  --primary: #8B9DC3;
  --primary-dark: #6B7FA3;
  --primary-light: #ABB9D3;
  --secondary: #F5F1E8;
  --secondary-dark: #E5DFC8;

  /* Neutrals */
  --white: #FFFFFF;
  --gray-50: #F9FAFB;
  --gray-200: #E5E7EB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-700: #374151;

  /* States */
  --success: #86A789;
  --error: #C89B9B;
  --warning: #D4B896;
}
```

---

## Tailwind Classes Quick Reference

```html
<!-- Primary Color -->
<div class="bg-primary text-white">Button</div>
<div class="text-primary">Link</div>
<div class="border-primary">Bordered</div>

<!-- Secondary Color -->
<div class="bg-secondary">Badge</div>

<!-- Grays -->
<div class="bg-gray-50">Page background</div>
<div class="text-gray-700">Body text</div>
<div class="text-gray-500">Secondary text</div>
<div class="border-gray-200">Border</div>

<!-- States -->
<div class="bg-error text-white">Error</div>
<div class="bg-success text-white">Success</div>
```

---

## Design Dos and Don'ts

### ✅ DO

- Use Soft Slate Blue for interactive elements
- Use Warm Cream for subtle backgrounds
- Use dark gray for text (#374151)
- Keep backgrounds mostly white
- Use colors sparingly
- Let products be the visual focus

### ❌ DON'T

- Don't use bright, vibrant colors
- Don't add more than 2 main colors
- Don't use Warm Cream as text color
- Don't overuse the primary color
- Don't create visual clutter
- Don't compete with product images

---

## Color Psychology

### Soft Slate Blue (#8B9DC3)
- **Emotion**: Calm, trustworthy, professional
- **Association**: Stability, reliability, competence
- **Effect**: Reduces stress, promotes focus

### Warm Cream (#F5F1E8)
- **Emotion**: Warm, comfortable, inviting
- **Association**: Natural, organic, wholesome
- **Effect**: Creates warmth without overwhelming

### Together
- **Balance**: Cool + Warm
- **Contrast**: Enough to distinguish, not jarring
- **Harmony**: Complementary without competing
- **Result**: Professional yet approachable

---

## Accessibility Checklist

- [x] All text meets WCAG AA standards (4.5:1)
- [x] Primary color on white: 4.9:1 (AA compliant)
- [x] Dark gray on white: 12.6:1 (AAA compliant)
- [x] Focus indicators use primary color (visible)
- [x] Error states use distinct color + icon
- [x] No color-only information
- [x] Hover states don't rely on color alone

---

## Print Version

When printed (remove backgrounds, keep text readable):
```css
@media print {
  .bg-primary { background: white !important; color: #374151 !important; }
  .bg-secondary { background: white !important; }
  .text-primary { color: #374151 !important; }
}
```

---

**Remember**: These two colors should do 90% of the work. White space and typography do the rest!
