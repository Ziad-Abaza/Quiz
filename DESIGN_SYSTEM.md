# Design System & UI Specification: Children's Tech Academy Web Platform

## ROLE
Senior UI/UX Architect & Frontend Design Engineer.

## CONTEXT
Development of a clean, playful, high-contrast, and child-friendly educational web platform. The design balances tech education (programming, robotics, AI) with accessible, clean modular components based on rounded cards, step badges, soft background tints, and saturated accent borders.

## OBJECTIVE
Deliver a complete design system file and token specifications to ensure pixel-perfect consistency across all views, worksheets, step-by-step guides, and interactive challenges.

---

## COLOR SYSTEM & DESIGN TOKENS

### 1. Brand & Foundation Colors
* **Brand Primary (Deep Space Navy):** `#0E1D4A` — Main headers, primary title cards, high-contrast text.
* **Brand Accent (Teal / University Cyan):** `#009688` / `#00A896` — Badges, brand icons, active states.
* **Canvas Background:** `#FAFAFD` / `#F7F9FC` — Main application background.
* **Card Surface:** `#FFFFFF` — Default container surface.
* **Border Standard:** `#E2E8F0` — Default neutral outline.
* **Text Primary:** `#1E293B` (Slate-800) — High-legibility body text.
* **Text Muted:** `#64748B` (Slate-500) — Subtitles, secondary descriptions.

### 2. Semantic Step & Module Color Matrix
Each module/part uses a high-contrast accent for borders, step badges, and title text, paired with a 5% opacity tint for card backgrounds:

| Step / Variant | Accent (Border & Badge) | Accent Hex | Surface Tint (Background) | Light Hover/Border |
| :--- | :--- | :--- | :--- | :--- |
| **01. Teal / Cyan** | Teal Cyan | `#0CA6A3` | `#F0FDFB` | `#99F6E4` |
| **02. Sky / Blue** | Electric Blue | `#0284C7` | `#F0F9FF` | `#BAE6FD` |
| **03. Purple** | Royal Violet | `#7C3AED` | `#F5F3FF` | `#DDD6FE` |
| **04. Pink / Rose** | Magenta Pink | `#E11D48` | `#FFF1F2` | `#FECDD3` |
| **05. Orange** | Amber Orange | `#EA580C` | `#FFF7ED` | `#FED7AA` |
| **06. Green** | Emerald Lime | `#16A34A` | `#F0FDF4` | `#BBF7D0` |

---

## TYPOGRAPHY SPECIFICATION

* **Primary Font Family:** `'Plus Jakarta Sans'`, `'Outfit'`, or `'Inter'`, sans-serif.
* **Arabic Complement (if multilingual):** `'Cairo'`, `'Alexandria'`, or `'Readex Pro'`.
* **Code / Hardware Values (Pins, Delay):** `'JetBrains Mono'`, `'Fira Code'`, monospace.

### Scale Hierarchy
* **Page Title (H1):** `font-weight: 800 (ExtraBold)`, `font-size: 2rem (32px)`, `color: #0E1D4A`.
* **Section Heading (H2):** `font-weight: 700 (Bold)`, `font-size: 1.5rem (24px)`, `color: #0E1D4A`.
* **Module Card Title:** `font-weight: 700 (Bold)`, `font-size: 1.125rem (18px)`, dynamic module accent color.
* **Body Text:** `font-weight: 500 (Medium)`, `font-size: 0.95rem (15px)`, `color: #334155`, `line-height: 1.5`.
* **Badges / Step Numbers:** `font-weight: 800 (ExtraBold)`, `font-size: 1rem (16px)`, `color: #FFFFFF`.

---

## COMPONENT ARCHITECTURE & STYLING RULES

### 1. Rounded Card Container
```css
.edu-card {
  background-color: #FFFFFF;
  border-radius: 1.25rem; /* 20px */
  border: 2px solid var(--step-accent-color);
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.04);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.edu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.08);
}