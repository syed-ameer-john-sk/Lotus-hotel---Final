# Design System: High-End Hospitality Editorial

## 1. Overview & Creative North Star: "The Modern Silk Road"
The Creative North Star for this design system is **"The Modern Silk Road."** This vision moves away from the cliché tropes of hospitality and instead embraces a cinematic, high-contrast editorial aesthetic. We are not building a website; we are curating a digital flagship for a luxury destination in Toulouse.

The system breaks the "template" look through **Intentional Asymmetry**. We utilize generous white space (represented here by deep blacks) and overlapping elements—where typography bleeds over imagery and glassmorphism layers soften the transition between content sections. The goal is a "Staggered Flow" that mimics the slow, deliberate pace of a fine-dining experience.

---

## 2. Colors & Tonal Depth
Our palette is rooted in the deep shadows of a moonlit lotus pond, punctuated by the warmth of Saffron and the prestige of Gold.

### The Palette
*   **Background (`#0A0A0A`):** The absolute canvas. Used to create infinite depth.
*   **Primary / Gold (`#C9A84C`):** Used for "The Golden Thread"—fine lines, accents, and high-level CTAs.
*   **Secondary / Saffron (`#E8732A`):** Used sparingly for interactive highlights and sensory cues (e.g., "Book a Table").
*   **Warm White (`#F5F0E8`):** Our primary text color. It provides a softer, more "parchment-like" contrast than pure white.

### The "No-Line" Rule
Designers are **prohibited** from using 1px solid borders to section off content. Boundaries must be defined through:
1.  **Background Shifts:** Transitioning from `surface` (`#141414`) to `surface_container_low` (`#1c1b1b`).
2.  **Atmospheric Depth:** Using the `surface_container_highest` (`#353534`) for nested elements to create a natural "lift."

### The "Glass & Gold" Rule
To achieve the "Zuma/Nobu" level of polish, use **Glassmorphism** for floating navigation and modal overlays. Apply a `backdrop-blur` of 20px+ with a semi-transparent `surface_variant` (`#353534` at 60% opacity). Main CTAs should feature a subtle linear gradient transitioning from `primary` (`#e6c364`) to `primary_container` (`#c9a84c`) at a 135-degree angle to simulate metallic sheen.

---

## 3. Typography: The Bilingual Dialogue
The typography system is a sophisticated interplay between French elegance and Indian heritage, represented through a serif/sans-serif hierarchy.

*   **Display & Headline (Playfair Display):**
    *   **The Signature Italic:** All English headlines must use *Playfair Display Italic*. This adds a kinetic, handwritten quality to the brand.
    *   **The French Roman:** French translations or primary headers use the standard weight.
    *   *Role:* High-end editorial impact. Large scales (`display-lg`: 3.5rem) should be used with `0.5` or `1` spacing tokens for tight, aggressive leading.
*   **Body & UI (Poppins):**
    *   **The Modern Foundation:** Used for all functional text, menus, and descriptions.
    *   *Role:* Clarity and breathability. Stick to weights 300 (Light) for descriptions and 400 (Regular) for interactive labels.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines. We use light and shadow to imply structure.

*   **The Layering Principle:** Place a `surface_container_lowest` (`#0e0e0e`) card on a `surface_container` (`#201f1f`) section. This creates a "recessed" look, making the card feel like an inset lacquer tray.
*   **Ambient Shadows:** For floating elements (e.g., a reservation drawer), use a shadow with a 40px blur and 5% opacity, tinted with `primary_fixed_dim` (`#e6c364`). It should feel like a warm glow, not a grey drop shadow.
*   **The "Ghost Border":** If a separation is strictly required for accessibility, use the `outline_variant` (`#4d4637`) at 15% opacity. This creates a "whisper" of a line that disappears into the background.

---

## 5. Components & UI Elements

### Buttons
*   **Primary:** `primary_container` background, `on_primary_container` text. No border. Roundedness: `sm` (0.125rem) for a sharp, architectural feel.
*   **Secondary (Ghost):** No background. `primary` text. A "Ghost Border" (15% opacity Gold) that illuminates to 100% on hover.

### Menu Cards & Lists
*   **Constraint:** Forbid the use of divider lines between menu items.
*   **Execution:** Use `spacing-6` (2rem) of vertical white space between dishes. Use `label-sm` in `secondary` (Saffron) for dietary markers (V, VG, GF), floating to the right of the dish name.

### Lotus Motif Dividers
*   When a section break is necessary for storytelling, use a single, centered Lotus Motif in `outline` (`#99907e`) at a very large scale, cropped by the edge of the container.

### Signature Component: The "Cinematic Reveal" Card
A card used for gallery items or signature dishes. It uses a `surface_container_lowest` base. Upon hover, the image subtly scales up (1.05x) and a Glassmorphism overlay slides up from the bottom containing the dish description in `body-sm`.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. Place a large `display-lg` headline on the left and a small `body-md` paragraph offset to the right.
*   **Do** use the Saffron (`secondary`) color as a "flavor" accent—minimal but high-impact (e.g., a notification dot or a price tag).
*   **Do** embrace "Dark Mode" as the only mode. Luxury is found in the shadows.

### Don’t:
*   **Don’t** use the `DEFAULT` or `xl` roundedness. Luxury in this context is sharp and precise; stick to `none` or `sm`.
*   **Don’t** use pure white text. It is too harsh against the `#0A0A0A` background and breaks the cinematic atmosphere. Always use `Warm White`.
*   **Don’t** use standard 12-column grids. Aim for a "broken grid" where images and text blocks overlap by `spacing-8` or `spacing-10` to create depth.