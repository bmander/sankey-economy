# Treemap Visual Design Spec: 5-Level Depreciation Drill-Down

## Context

The depreciation treemap is expanding from 3 levels to 5 levels deep. The current tree is:

```
Depreciation (CCA) $5T           [depth 0 - root]
  Private $4.3T                  [depth 1]
    Nonresidential $3.05T        [depth 2]
      Structures $650B           [depth 3 - leaf]
      Equipment $1.1T            [depth 3 - leaf]
      Intellectual Property $1.3T [depth 3 - leaf]
    ...
  Government $700B               [depth 1]
    ...
```

With the expansion, depth 3 items (like "Equipment") will themselves have children, pushing leaves to depth 4 and potentially depth 5. This creates challenges around color differentiation, label density, padding overhead, and navigation.

---

## 1. Color Strategy

### Problem

The current scheme uses two linear scales (orange for Private, blue for Government) with sibling-index interpolation. At 5 levels, this produces too many visually indistinguishable cells because the interpolation range is narrow and there are many more leaf nodes.

### Recommendation: Hierarchical Hue + Saturation Encoding

Use the depth-1 ancestor (Private vs Government) to set the **hue family**, then use **saturation and lightness** to encode depth. Siblings at the same level are distinguished by slight hue shifts within their family.

#### Hue Families (depth 1)

| Ancestor     | Hue Base | Hue Range   |
|-------------|----------|-------------|
| Private      | 25 (orange) | 15 - 40     |
| Government   | 210 (blue)  | 195 - 225   |

#### Depth-to-Lightness Mapping (HSL)

| Depth | Saturation | Lightness | Visual Effect             |
|-------|-----------|-----------|---------------------------|
| 1     | 80%       | 38%       | Deepest, most saturated   |
| 2     | 72%       | 44%       | Slightly lighter          |
| 3     | 60%       | 52%       | Mid-range                 |
| 4     | 48%       | 62%       | Noticeably lighter        |
| 5     | 35%       | 72%       | Lightest, most washed out |

This creates a natural visual cue: **deeper = lighter**, which reinforces the "drilling in" metaphor. Parent cells with their own padded header strips will be darker than their children, making the hierarchy visually scannable without labels.

#### Sibling Differentiation

Within a depth level, shift the hue by `index * (hueRange / siblingCount)` to create subtle but perceivable differences. For example, three siblings in the Private family at depth 3 might be hsl(18, 60%, 52%), hsl(25, 60%, 52%), hsl(33, 60%, 52%).

#### Implementation (pseudocode)

```javascript
function cellColor(d) {
  let ancestor = d;
  while (ancestor.depth > 1) ancestor = ancestor.parent;

  const isPrivate = ancestor.data.name === "Private";
  const hueBase = isPrivate ? 25 : 210;
  const hueRange = isPrivate ? 25 : 30;

  // Depth mapping
  const depth = Math.min(d.depth, 5);
  const sat = 80 - (depth - 1) * 10;   // 80 -> 40
  const lit = 38 + (depth - 1) * 9;    // 38 -> 74

  // Sibling hue shift
  const siblings = d.parent ? d.parent.children : [d];
  const idx = siblings.indexOf(d);
  const hueShift = siblings.length > 1
    ? (idx / (siblings.length - 1) - 0.5) * hueRange
    : 0;

  return `hsl(${hueBase + hueShift}, ${sat}%, ${lit}%)`;
}
```

#### Colorblind Notes

Orange vs blue hue families remain fully distinguishable under deuteranopia, protanopia, and tritanopia. The lightness gradient provides a secondary (non-color) channel for depth perception.

---

## 2. Label Strategy

### Problem

At 5 levels with 12+ leaf categories, many cells will be too small for full labels. The current approach (check width > 40 and height > 20) works at 3 levels but will leave many cells unlabeled at deeper levels, creating an information void.

### Recommendation: Tiered Label Rules

#### Group Headers (depth 1-3, non-leaf nodes with children)

These nodes act as containers. Their labels go in the **padding-top strip** of the treemap cell.

| Depth | Font Size | Font Weight | Transform  | Content                |
|-------|-----------|------------|------------|------------------------|
| 1     | 11px      | 700        | UPPERCASE  | Name + value           |
| 2     | 10px      | 700        | UPPERCASE  | Name + value (if fits) |
| 3     | 9px       | 600        | Normal     | Name only              |

**Visibility rule for group headers**: Show if cell width >= 60px. Below that, hide entirely (tooltip only).

#### Leaf Cell Labels (depth 3-5)

| Cell Dimension        | Show Name? | Show Value? | Show %? | Font Size |
|-----------------------|-----------|------------|---------|-----------|
| w >= 80, h >= 50      | Yes       | Yes        | Yes     | 11/10/9px |
| w >= 60, h >= 36      | Yes       | Yes        | No      | 10/9px    |
| w >= 40, h >= 22      | Yes (truncated) | No  | No      | 9px       |
| w >= 25, h >= 14      | Abbreviation only | No | No     | 8px       |
| Below those minimums  | No (tooltip only) | No | No     | -         |

#### Abbreviation Map

For the smallest visible cells, use a built-in abbreviation map:

```javascript
const ABBREV = {
  "Structures": "Struc.",
  "Equipment": "Equip.",
  "Intellectual Property": "IP",
  "Defense": "Def.",
  "Nondefense": "Non-Def.",
  "Equipment & Other": "Equip.",
  // ... extend as new categories are added
};
```

#### Text Contrast

- **Depth 1-3 cells (dark fills)**: White labels (`#fff`) at full opacity for name, 85% opacity for value, 70% opacity for percentage. Same as current.
- **Depth 4-5 cells (lighter fills)**: Switch to dark labels (`var(--color-text-primary)`) when lightness > 58%. Use the formula:

```javascript
const useDarkText = (lightness > 58);
const fillColor = useDarkText ? "var(--color-text-primary)" : "#fff";
```

This ensures WCAG AA contrast (4.5:1 minimum) at all depth levels.

---

## 3. Padding Strategy

### Problem

Current padding (top: 20, inner: 3, outer: 2) at 5 levels means significant dead space. The padding compounds: 5 levels of `paddingTop: 20` could consume 100px of vertical space in the worst case, eating into cell real estate.

### Recommendation: Depth-Adaptive Padding

Instead of uniform padding, use **depth-variable padding** via d3-treemap's `paddingTop` function:

```javascript
d3.treemap()
  .size([tmWidth, tmHeight])
  .paddingTop(d => {
    // d.depth: 0 = root, 1 = Private/Govt, 2 = Nonres/Res/etc, 3+ = new deeper levels
    if (d.depth === 0) return 0;   // Root has no header (title is outside treemap)
    if (d.depth === 1) return 18;  // Major sector headers
    if (d.depth === 2) return 15;  // Sub-sector headers
    if (d.depth === 3) return 12;  // Asset-type headers
    return 0;                       // Deeper levels: no header padding
  })
  .paddingInner(2)
  .paddingOuter(1)
  .round(true);
```

#### Rationale

- **Depth 1** (Private/Government): 18px gives enough room for 11px UPPERCASE headers with breathing room.
- **Depth 2** (Nonresidential, Residential, etc.): 15px for 10px headers.
- **Depth 3** (sub-breakdowns): 12px for 9px headers. This is the tightest comfortable fit.
- **Depth 4+**: No header padding. These are leaf nodes or near-leaf; their labels go inside the cell body.
- **Inner padding**: Reduced from 3 to 2px. This preserves visual separation while reclaiming significant space (at 5 levels, each pixel saved compounds).
- **Outer padding**: Reduced from 2 to 1px.

#### Space Budget

At 3 levels the current spec uses: 20 + 20 + 3 + 3 + 2 + 2 = ~50px overhead per column.
The new spec uses: 18 + 15 + 12 + 2 + 2 + 2 + 1 + 1 = ~53px overhead, only marginally more despite adding 2 extra levels. This is because we do not pad depth 4+ and tightened the inner/outer gaps.

---

## 4. Interaction Design

### 4a. Hover: Parent Highlight

**Yes, hovering a leaf should subtly highlight its parent chain.**

When a leaf cell is hovered:
1. The hovered cell gets a 2px white stroke (current behavior is no stroke change; adding one gives a clear "selected" signal).
2. All sibling cells under the same depth-2 parent get a subtle brightness boost (filter: brightness(1.08)).
3. Non-sibling cells dim slightly (opacity: 0.7).

This creates a "family spotlight" effect that helps the user understand the hierarchy without needing breadcrumbs on hover.

Implementation:

```javascript
cells.on("mouseover", function(event, d) {
  // Dim all cells
  cells.select("rect").style("opacity", 0.7);

  // Highlight siblings (same parent)
  const siblingData = d.parent ? d.parent.leaves() : [d];
  cells.filter(c => siblingData.includes(c))
    .select("rect")
    .style("opacity", 1)
    .style("filter", "brightness(1.08)");

  // Highlight hovered cell with stroke
  d3.select(this).select("rect")
    .style("stroke", "#fff")
    .style("stroke-width", 2)
    .style("opacity", 1)
    .style("filter", "brightness(1.12)");

  // Show tooltip (existing behavior)
  // ...
});
```

On mouseout, reset all cells to default opacity and remove stroke/filter.

### 4b. Breadcrumb Path in Tooltip

Instead of a persistent breadcrumb bar (which would consume layout space), show the hierarchy path **inside the tooltip**. The current implementation already does this:

```
Intellectual Property
$1.3T
26.0% of total depreciation
Depreciation (CCA) > Private > Nonresidential
```

At 5 levels, this path gets longer (e.g., "Depreciation > Private > Nonresidential > Equipment > Computers"). The path should use the abbreviated form when it exceeds 40 characters:

```javascript
function breadcrumbPath(d) {
  const ancestors = d.ancestors().reverse().slice(1).map(a => a.data.name);
  const full = ancestors.join(" > ");
  if (full.length <= 40) return full;
  // Abbreviate: show first, ellipsis, last two
  if (ancestors.length > 3) {
    return `${ancestors[0]} > ... > ${ancestors.slice(-2).join(" > ")}`;
  }
  return full;
}
```

### 4c. Click-to-Zoom (Optional Enhancement)

If the team decides to support it: clicking a non-leaf cell at depth 2+ could "zoom in" to show only that subtree filling the full treemap area. This would reuse the same enter/exit animation pattern as the current Sankey-to-treemap transition. The back button already exists and could adopt a "breadcrumb stack" behavior (each click goes up one level).

This is a stretch goal. The hover + tooltip path approach should be implemented first and may be sufficient for 5 levels.

---

## 5. CSS Additions

The following new CSS rules are needed to support the spec above:

```css
/* Depth-adaptive group labels */
.treemap-group-label--d1 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.treemap-group-label--d2 {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.treemap-group-label--d3 {
  font-size: 9px;
  font-weight: 600;
}

/* Leaf cell label sizes for tiny cells */
.treemap-cell-label--sm {
  font-size: 9px;
}

.treemap-cell-label--xs {
  font-size: 8px;
}

/* Dark text variant for light-filled cells at depth 4-5 */
.treemap-cell-label--dark {
  fill: var(--color-text-primary);
}

.treemap-cell-value--dark {
  fill: var(--color-text-secondary);
}

.treemap-cell-pct--dark {
  fill: var(--color-text-tertiary);
}

/* Hover highlight on treemap cells */
.treemap-cell rect {
  transition: opacity var(--transition-fast),
              filter var(--transition-fast),
              stroke-width var(--transition-fast);
}

.treemap-cell.is-hovered rect {
  stroke: #fff;
  stroke-width: 2;
  filter: brightness(1.12);
}

.treemap-cell.is-dimmed rect {
  opacity: 0.7;
}

.treemap-cell.is-sibling rect {
  filter: brightness(1.08);
}
```

---

## 6. Summary of Changes

| Aspect          | Current (3 levels)                      | Recommended (5 levels)                        |
|-----------------|-----------------------------------------|-----------------------------------------------|
| Colors          | 2 linear scales (orange, blue)          | HSL depth encoding: deeper = lighter          |
| Sibling color   | Index-based interpolation               | Hue shift within family range                 |
| Text on dark    | White only                              | White for depth 1-3, dark for depth 4-5       |
| Label minimum   | w >= 40, h >= 20                        | Tiered: full / truncated / abbreviated / hidden |
| Abbreviations   | None                                    | Built-in abbreviation map for small cells     |
| Group headers   | Uniform 10px uppercase                  | Depth-adaptive: 11/10/9px, uppercase fades out |
| paddingTop      | 20 (uniform)                            | 18/15/12/0 by depth                           |
| paddingInner    | 3                                       | 2                                             |
| paddingOuter    | 2                                       | 1                                             |
| Hover effect    | Tooltip only                            | Sibling highlight + tooltip with path         |
| Breadcrumb      | Full path in tooltip                    | Abbreviated path for long chains              |
| Click-to-zoom   | Not supported                           | Optional: zoom into subtree (stretch goal)    |
