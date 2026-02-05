# Sankey Economy -- Visual Design Specification

## Design Philosophy

The visual language draws from data journalism at outlets like the New York Times and Washington Post. The goal is to present complex economic flow data with clarity and credibility. Every design choice serves readability first: neutral backgrounds push the colorful flows forward, generous whitespace prevents cognitive overload, and typography borrows from editorial tradition to signal authority.

---

## Typography

| Role       | Family                          | Weight  | Notes                                |
|------------|---------------------------------|---------|--------------------------------------|
| Display    | Source Serif 4 (Google Fonts)   | 700     | Headlines, section titles            |
| Body       | Inter (Google Fonts)            | 400/600 | Prose, labels, UI controls           |
| Monospace  | JetBrains Mono / system mono   | 400     | Dollar figures in tooltips/details   |

**Google Fonts link for HTML head:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@400;700&display=swap" rel="stylesheet">
```

Fluid type sizing uses `clamp()` so headlines scale smoothly from phone to desktop without breakpoint jumps.

---

## Color Palette

### Category Colors

Colors are sourced from ColorBrewer sequential/qualitative palettes, which are specifically engineered for cartographic and data-visualization use and have been validated for colorblind accessibility.

| Category       | CSS Variable        | Hex       | Usage                              |
|----------------|---------------------|-----------|------------------------------------|
| Government     | `--color-govt`      | `#2171b5` | Federal, state, local govt nodes   |
| Households     | `--color-household` | `#238b45` | Consumer/household sector nodes    |
| Business       | `--color-business`  | `#d94701` | Corporations, enterprise nodes     |
| Financial      | `--color-financial` | `#6a51a3` | Banks, Fed Reserve, markets        |
| Rest of World  | `--color-trade`     | `#636363` | Imports, exports, foreign entities |

Each category includes `-light`, `-lighter`, and `-dark` variants for gradients, hover states, and supporting UI.

### Colorblind Accessibility

The five-color palette was tested against:
- **Deuteranopia** (red-green, ~6% of males): Blue, green, orange, purple, gray remain distinguishable because they span hue, saturation, AND luminance.
- **Protanopia** (red-blind): Orange shifts toward yellow-brown but remains distinct from blue/green/purple.
- **Tritanopia** (blue-yellow, rare): Blue and purple converge somewhat, but luminance differences plus the gray channel preserve discrimination.

Additionally, the Sankey links carry category color at partial opacity over a white background, and hover/focus interactions provide a secondary (non-color) channel for identification.

### Surface and Text Colors

| Token               | Hex       | Use                    |
|----------------------|-----------|------------------------|
| `--color-bg`         | `#fafaf8` | Page background        |
| `--color-surface`    | `#ffffff` | Card/panel background  |
| `--color-surface-alt`| `#f3f2ee` | Legend, alt backgrounds |
| `--color-text-primary`   | `#1a1a1a` | Headings, key text |
| `--color-text-secondary` | `#555550` | Body copy          |
| `--color-text-tertiary`  | `#8a8a82` | Captions, labels   |

The warm-gray tint (`#fafaf8` instead of pure white) reduces glare and gives the page a print-like feel.

---

## Sankey Diagram Interactions

### Link (Flow) Behavior

| State     | Opacity | Trigger        |
|-----------|---------|----------------|
| Default   | 0.35    | --             |
| Hover     | 0.65    | Mouseover link |
| Muted     | 0.08    | Other focused  |

When a user hovers a node or link, the container gets a `.has-focus` class. All non-related links drop to 0.08 opacity while the highlighted links rise to 0.65. This "dim the rest" pattern is standard in interactive Sankey diagrams and makes individual flows easy to trace.

### Node Behavior

Nodes are colored rectangles. On hover they reduce to 0.85 opacity (subtle press effect). Clicking a node opens the detail panel (slide-in from the right).

### Tooltip

Tooltips appear on hover over both nodes and links:
- Positioned absolutely within the `.sankey-container`
- Animate in with a subtle 4px upward slide + fade
- Show: category color swatch, flow label (source arrow target), dollar value, and optional detail text
- Max width 280px, 220px on tablet

### Detail Panel

A slide-in panel (right edge, 420px wide, full viewport on mobile) for deep-dive information about a selected node. Contains stat rows with label-value pairs. Closeable via an X button.

---

## Layout

- Max content width: 1200px (1360px on screens wider than 1400px)
- Horizontal padding: 24px, reducing to 16px on tablets
- The Sankey SVG is full-width within its container card
- Legend sits at the bottom of the Sankey card
- Controls bar sits above the diagram (filter/view toggles)

---

## Responsive Strategy

| Breakpoint | Target           | Key Adjustments                          |
|------------|------------------|------------------------------------------|
| > 1400px   | Large desktop    | Wider max-width (1360px)                 |
| <= 768px   | Tablet           | Reduced padding, smaller node labels     |
| <= 480px   | Phone            | Stacked legend, stacked controls, full-width detail panel |

The SVG diagram itself should be programmatically re-laid-out at narrow widths (handled in JS), but CSS ensures all surrounding UI adapts.

---

## Accessibility

- **Reduced motion**: All transitions collapse to near-zero duration via `prefers-reduced-motion: reduce`.
- **High contrast mode**: `forced-colors: active` overrides ensure nodes, links, and tooltips use system colors.
- **Screen readers**: A `.visually-hidden` utility class is provided for off-screen descriptive text (e.g., a text summary of the flows for screen reader users).
- **Keyboard**: The detail panel and interactive controls should be keyboard-navigable (JS responsibility, but CSS provides focus-visible styles via browser defaults).

---

## Print

When printed:
- Controls, tooltips, and detail panel are hidden
- Container borders and shadows are removed
- Link opacity is fixed at 0.4 for consistent ink rendering
- Footer shrinks to save space

---

## CSS Architecture

The stylesheet uses CSS custom properties (design tokens) at the `:root` level. No preprocessor is needed. Class naming follows a flat BEM-lite convention:

- `.sankey-node`, `.sankey-link` -- diagram elements
- `.node-govt`, `.link-business` -- category modifiers
- `.is-active`, `.is-visible`, `.is-highlighted`, `.has-focus` -- state classes
- `.tooltip-title`, `.tooltip-value` -- component sub-elements

All transitions use the `--transition-*` tokens for consistency. No `!important` outside of print styles.

---

## File Reference

| File          | Purpose                                           |
|---------------|---------------------------------------------------|
| `styles.css`  | Complete stylesheet, no build step required        |
| `DESIGN.md`   | This document                                     |
