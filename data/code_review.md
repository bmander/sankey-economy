# Code Review: Depreciation Treemap Drill-Down

Reviewed files:
- `/Users/bmander/Documents/GitHub/sankey-economy/index.html` (lines 534-876, plus click handler integration at 401-440)
- `/Users/bmander/Documents/GitHub/sankey-economy/styles.css` (lines 823-933)

---

## Bugs

### BUG-1: Transition `on("end")` callback never fires if selection is empty or transition is interrupted (index.html:656-669)

In `enterTreeView()`, the code counts `on("end")` callbacks to know when the fade-out is complete:

```js
let doneCount = 0;
const total = sankeyEls.size();
sankeyEls
  .transition()
  .duration(400)
  .style("opacity", 0)
  .on("end", function() {
    d3.select(this).style("display", "none");
    doneCount++;
    if (doneCount === total) {
      renderTree();
      treeTransitioning = false;
    }
  });
```

If any element's transition is interrupted (e.g., by a rapid window resize triggering a reflow, or by any other D3 transition accidentally targeting the same elements), the `on("end")` callback will not fire for the interrupted elements. When that happens, `doneCount` will never reach `total`, `renderTree()` will never be called, `treeTransitioning` will remain `true`, and the UI will be permanently stuck -- the user sees a blank chart with no way to recover.

**Fix**: Use `transition().end()` which returns a Promise that resolves when all transitions finish, or use `on("end")` on only one element rather than counting. Alternatively, add an `on("interrupt")` handler to clean up:

```js
.on("interrupt", function() {
  doneCount++;
  d3.select(this).style("display", "none");
  if (doneCount === total) {
    renderTree();
    treeTransitioning = false;
  }
})
```

### BUG-2: Same `on("end")` counting vulnerability in `exitTreeView()` (index.html:706-719)

Identical problem. If any element's transition is interrupted during the Sankey fade-in, `restoreCount` never reaches `restoreTotal`, and `treeTransitioning` stays `true` forever. The diagram becomes permanently non-interactive.

### BUG-3: `treeGroup` set to `null` before fade-out transition completes (index.html:697)

In `exitTreeView()`:

```js
if (treeGroup) {
  treeGroup.interrupt();
  treeGroup
    .transition()
    .duration(300)
    .style("opacity", 0)
    .on("end", function() {
      d3.select(this).remove();
    });
  treeGroup = null;  // <-- set to null immediately
}
```

Setting `treeGroup = null` right after starting the transition means that if `enterTreeView()` is called during the 300ms window (even though `treeTransitioning` should block this, the guard could be bypassed in edge cases), the stale tree DOM elements from the fade-out are orphaned -- they never get removed because the reference is gone. Meanwhile, `enterTreeView()` lines 648-652 check `treeGroup` to clean up previous tree elements, but it's already null.

This is a minor issue since `treeTransitioning` should prevent re-entry, but it creates a fragile coupling between the two guards.

### BUG-4: Body click handler fires tree exit even when clicking inside the treemap (index.html:430-440)

```js
d3.select("body").on("click", function() {
  if (treeViewActive && !treeTransitioning) {
    exitTreeView();
    return;
  }
  ...
});
```

Clicking on a treemap cell's `<rect>` will bubble up to `body` and trigger `exitTreeView()`. The treemap cell event handlers on lines 852-869 handle tooltips, but none of them call `event.stopPropagation()`. This means:

1. User hovers a treemap cell (tooltip appears).
2. User clicks the cell (expecting nothing, or further drill-down later).
3. Click bubbles to body -> `exitTreeView()` fires -> tree disappears.

While this might be partially intentional ("click anywhere to go back"), it is at odds with the back button's existence and makes it impossible to click on treemap cells without exiting. If deeper drill-down is ever added, this will block it.

**Fix**: Add `event.stopPropagation()` to treemap cell click handlers, or wrap the body handler to check if the click target is inside the tree-view group.

---

## UX Issues

### UX-1: No visual indication that depreciation node is clickable (index.html:622-629, styles.css:920-932)

The "Click to explore" hint only appears on hover (`.sankey-node:hover .depreciation-hint { opacity: 1 }`), but there is nothing in the default state that distinguishes this node from any other. Users who don't happen to hover over it will never discover the treemap feature. On touch devices, hover is not available at all, so the hint is essentially invisible.

**Suggestion**: Add a subtle persistent visual cue -- a small icon or a different stroke/border on the depreciation node rect. Consider making the hint visible by default at reduced opacity (e.g., `opacity: 0.5`) instead of fully hidden.

### UX-2: No focus management when entering/exiting tree view (index.html:638-720)

When the tree view opens, focus stays wherever it was (likely the clicked node, which is now invisible). Screen reader users will be stranded on an invisible element. When exiting, focus is not returned to the depreciation node.

**Fix**: After `renderTree()`, call `backBtn.focus()`. After `exitTreeView()`, focus the depreciation node's rect element.

### UX-3: Tooltip follows mouse into off-screen areas during treemap view (index.html:246-257)

The `positionTooltip()` function only checks the right edge and top edge. It does not check if the tooltip goes below the viewport bottom. On shorter viewports or when hovering cells at the bottom of the treemap, the tooltip can be clipped or cause scrollbars.

**Fix**: Add a bottom-edge check:
```js
const ttHeight = tooltip.node().getBoundingClientRect().height;
if (y + ttHeight > window.innerHeight) {
  y = event.pageY - ttHeight - pad;
}
```

### UX-4: Back button overlaps treemap title at narrow widths

The back button is positioned at `top: var(--space-4); left: var(--space-4)` (absolute within the container), while the treemap title is rendered at SVG coordinates `(0, -6)` which after the margin transform places it near the top-left. On narrow screens where margins compress, these can overlap.

### UX-5: Legend clicks still work during tree view (index.html:489-512)

The legend click handler does not check `treeViewActive`. If the user clicks a legend item while the tree view is showing, it will apply highlight classes to the hidden Sankey elements. When the user exits tree view, those stale highlight states will be visible. The `exitTreeView()` function does clear highlights (line 701-702), which partially mitigates this, but there is a flash of stale state during the fade-in.

**Fix**: Add `if (treeViewActive) return;` at the top of the legend click handler.

---

## D3 Best Practices

### D3-1: Using `d3.select(this)` inside arrow-adjacent patterns (index.html:663-664)

The code correctly uses `function()` (not arrow functions) for D3 event callbacks where `this` is needed, which is good. However, the `on("end")` callbacks use `d3.select(this)` which is correct -- no issue here, just noting it was done right.

### D3-2: `sankeyEls` selection captures groups, not individual elements (index.html:655-656)

```js
const sankeyEls = svg.selectAll(".sankey-links, .sankey-nodes");
```

This selects the two `<g>` wrapper elements, not the individual node/link elements. So `total` is always 2, and the counter approach works for this specific case. However, this means the `.style("display", "none")` is applied to the group containers, which is fine, but it's a subtle detail that could break if someone refactors to add more group elements.

### D3-3: Treemap cells don't use data keys (index.html:799-803)

```js
const cells = tmContent.selectAll(".treemap-cell")
  .data(leaves)
  .join("g")
```

No key function is provided. Since the treemap is only rendered once (fresh each time), this is not a bug, but if an animated transition between different tree states is ever added, the lack of keys will cause enter/update/exit to malfunction.

---

## Edge Cases

### EDGE-1: Rapid double-click on depreciation node

The `treeTransitioning` guard at line 410 prevents this. This is handled correctly.

### EDGE-2: Window resize during tree view (index.html:528-531)

```js
window.addEventListener("resize", () => {
  const d = getDimensions();
  svgEl.attr("viewBox", `0 0 ${d.width + margin.left + margin.right} ${d.height + margin.top + margin.bottom}`);
});
```

The resize handler updates the SVG viewBox, but the treemap was laid out using the *original* `dims.width` and `dims.height` (captured once at page load on line 221). The treemap will not reflow on resize. Due to `preserveAspectRatio="xMidYMid meet"`, the SVG will scale proportionally, so this is not catastrophic, but the treemap's aspect ratio may not match the new viewBox dimensions, leading to either letterboxing or content overflow within the SVG coordinate system.

**Fix**: Either re-render the treemap on resize, or accept the scaling behavior and document it. At minimum, debounce the resize handler.

### EDGE-3: Entering tree view while a node is being hovered

If the user hovers the depreciation node (which triggers `temporaryHighlight()`), then clicks it (which calls `enterTreeView()`), the `clearHighlight()` at line 643 properly resets the state. However, the `mouseout` handler on the node group (line 391-396) may fire *after* the tree transition starts (since the node fades out), which calls `clearHighlight()` a second time on already-cleared state. This is harmless but wasteful.

### EDGE-4: Escape key during body click exit

If the user presses Escape while `exitTreeView()` is already running (triggered by body click), the guard `if (!treeViewActive || treeTransitioning) return;` at line 677 correctly prevents double-exit. This is handled.

---

## Integration Issues

### INT-1: Tooltip reuse works correctly

The treemap reuses the same tooltip element and functions (`showTooltip`, `positionTooltip`, `hideTooltip`). This is clean and correct.

### INT-2: `selectedNode` is correctly nulled on tree entry (index.html:642)

Good -- prevents stale highlight state when returning.

### INT-3: Tree click handler on nodes does not account for non-depreciation node clicks during tree view (index.html:418)

```js
if (treeViewActive) return;
```

This is at line 418, inside the *Sankey node* click handler. Since the Sankey nodes are hidden (`display: none`), they can't actually receive clicks during tree view. This guard is redundant but harmless.

---

## Performance

### PERF-1: Tree is re-created from scratch every time (index.html:722-876)

Every call to `renderTree()` rebuilds the entire D3 hierarchy, runs the treemap layout, creates all DOM elements, and binds all events. If the user rapidly clicks in and out, this is wasteful. Since the data is static, the layout result could be cached.

**Suggestion**: Compute the treemap layout once and cache it. On subsequent `enterTreeView()` calls, just show the existing group instead of rebuilding.

### PERF-2: No transition cleanup on tooltip during view switch

If a tooltip is visible when `enterTreeView()` starts, it remains visible because no `hideTooltip()` is called in `enterTreeView()`. The tooltip will linger until the user moves the mouse. This is a minor visual glitch rather than a performance issue.

**Fix**: Add `hideTooltip()` at the start of `enterTreeView()` and `exitTreeView()`.

---

## Accessibility

### A11Y-1: Treemap has no ARIA labels or screen-reader text (index.html:760-876)

The treemap group, cells, and text labels have no `role`, `aria-label`, or `aria-describedby` attributes. Screen readers will encounter raw SVG text elements with no structural context. Compare this to the Sankey SVG which at least has `role="img"` and an `aria-label` (line 228-229).

**Fix**: Add `role="img"` and `aria-label` to the tree-view group. Add `role="list"` / `role="listitem"` semantics to cell groups, or at minimum add a visually-hidden text description summarizing the depreciation breakdown.

### A11Y-2: Back button has no `aria-label` (index.html:612-613)

The back button's text content ("<- Back to overview") is somewhat screen-reader-friendly because it includes text, but the HTML arrow entity may be read aloud oddly. Consider adding `aria-label="Back to Sankey overview"`.

### A11Y-3: No keyboard navigation for treemap cells

Treemap cells cannot receive focus (no `tabindex`), so keyboard users cannot explore the breakdown at all. The only keyboard interaction is Escape to exit (line 632-636).

**Fix**: Add `tabindex="0"` to treemap cell `<g>` elements and handle `focus`/`blur` events to show/hide tooltips.

### A11Y-4: `prefers-reduced-motion` is handled in CSS but not in JS transitions (styles.css:760-765)

The CSS rule collapses all CSS transitions to ~0ms, but the D3 JavaScript transitions (400ms, 300ms, 500ms durations in `enterTreeView`/`exitTreeView`/`renderTree`) are not affected by CSS media queries because they use D3's transition system, not CSS transitions.

**Fix**: Check `window.matchMedia('(prefers-reduced-motion: reduce)')` and set D3 transition durations to 0 when it matches:

```js
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DURATION = reduceMotion ? 0 : 400;
```

---

## Summary of Severity

| ID | Severity | Category | Summary |
|----|----------|----------|---------|
| BUG-1 | **High** | Bug | Interrupted transitions permanently freeze UI |
| BUG-2 | **High** | Bug | Same freeze risk on exit path |
| BUG-4 | **Medium** | Bug | Clicking treemap cells exits tree view |
| A11Y-4 | **Medium** | Accessibility | JS transitions ignore reduced-motion preference |
| UX-1 | **Medium** | UX | Drill-down is undiscoverable without hover |
| UX-2 | **Medium** | UX | No focus management on view switch |
| PERF-2 | **Low** | Bug | Tooltip lingers across view transitions |
| UX-3 | **Low** | UX | Tooltip clips below viewport |
| UX-5 | **Low** | UX | Legend clicks have no effect but aren't blocked during tree view |
| A11Y-1 | **Medium** | Accessibility | Treemap has no ARIA semantics |
| A11Y-3 | **Medium** | Accessibility | Treemap cells not keyboard-navigable |
| BUG-3 | **Low** | Bug | treeGroup nulled before removal transition finishes |
| EDGE-2 | **Low** | Edge case | Treemap does not reflow on resize |
| PERF-1 | **Low** | Performance | Tree rebuilt from scratch each time |
| D3-3 | **Info** | D3 | No data keys on treemap join |
| INT-3 | **Info** | Integration | Redundant guard in hidden-node click handler |
