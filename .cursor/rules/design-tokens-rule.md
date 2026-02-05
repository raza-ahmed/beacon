# Figma Variables / Design Tokens

## Source of Truth
- Figma design system is the source of truth for all design tokens
- Reference: https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System
- All style values must reference design tokens, never hardcode colors, spacing, or typography values

## When to Use Tokens
- **Always use tokens** for colors, spacing, typography, borders, corner radius, and icon sizes
- **Never hardcode** hex colors, pixel values for spacing, or font sizes
- Use tokens for semantic colors (primary, success, warning, critical) rather than raw color values

## Token Categories

### Colors
- Use semantic color tokens: `Foreground/Primary`, `Background/Success`, `Border/Critical`, etc.
- Use neutral tokens for text: `Foreground/Neutral`, `Foreground/Neutral Secondary`, `Foreground/Neutral Tertiary`
- Use alpha/transparency tokens: `Color/Alpha-Neutral/W100`, `Color/Alpha-Neutral/B200` for overlays
- Map to CSS: `var(--fg-primary)`, `var(--bg-success)`, `var(--border-critical)`, `var(--fg-neutral)`

### Spacing
- Use spacing scale tokens: `Spacing/50` (2px), `Spacing/100` (4px), `Spacing/200` (8px), `Spacing/300` (12px), `Spacing/400` (16px), `Spacing/500` (24px), `Spacing/600` (32px), `Spacing/700` (48px), `Spacing/800` (64px), `Spacing/1000` (128px)
- Apply for padding, margin, gaps, and positioning
- Map to CSS: `var(--spacing-50)`, `var(--spacing-100)`, `var(--spacing-200)`, etc.

### Typography
- Use typography tokens: `Heading/H3`, `Heading/H6`, `Title/Regular`, `Body2/Regular`, `Body2/Medium`, `Body3/Regular`, `Body3/Medium`
- Typography tokens include family, weight, size, line height, and letter spacing
- Apply via CSS classes or inline styles using font tokens
- Map to CSS: Use font family `var(--font-primary)` or `var(--font-secondary)`, weights `var(--font-weight-secondary-medium)`, etc.

### Corner Radius
- Use radius tokens: `Corner Radius/None` (0), `Corner Radius/200` (8px), `Corner Radius/400` (16px)
- Apply for border-radius on cards, buttons, inputs, and other rounded elements
- Map to CSS: `var(--corner-radius-none)`, `var(--corner-radius-200)`, `var(--corner-radius-400)`

### Border Width
- Use border width tokens: `Border Width/None` (0), `Border Width/50` (2px)
- Apply for border-width property
- Map to CSS: `var(--border-width-none)`, `var(--border-width-50)`

### Icon Sizes
- Use icon size tokens: `Icon Size/xs` (16px)
- Apply for icon width/height dimensions
- Map to CSS: `var(--icon-size-xs)`

### Backgrounds
- Use semantic background tokens: `Background/Page Primary`, `Background/Page Secondary`, `Background/Page Tertiary`, `Background/Page Base`
- Use action tokens: `Background/Primary`, `Background/Success`, `Background/Warning`, `Background/Critical`
- Map to CSS: `var(--bg-page-primary)`, `var(--bg-primary)`, `var(--bg-success)`, etc.

### Borders
- Use semantic border tokens: `Border/Neutral Primary`, `Border/Neutral Secondary`, `Border/Neutral Tertiary`
- Use semantic action borders: `Border/Primary`, `Border/Success`, `Border/Warning`, `Border/Critical`
- Map to CSS: `var(--border-neutral-primary)`, `var(--border-primary)`, etc.

### Utilities
- Use overlay tokens: `Utilities/Overlay Dull`, `Utilities/Overlay Light`, `Utilities/Overlay Medium`, `Utilities/Overlay Strong`
- Use pattern tokens: `Utilities/Pattern Ink 1`, `Utilities/Pattern Ink 2`, `Utilities/Pattern Ink 3`, `Utilities/Pattern Ink 4`
- Use alpha tokens: `Utilities/Bright Alpha 100`, `Utilities/Bright Alpha 200`, `Utilities/Bright Alpha 300`, `Utilities/Bright Alpha 400`, `Utilities/Bright Alpha 500`
- Map to CSS: `var(--overlay-dull)`, `var(--pattern-ink-1)`, `var(--bright-alpha-100)`, etc.

## How to Apply Tokens

### CSS Custom Properties
- Always use CSS custom properties format: `var(--token-name)`
- Tokens are available after importing `beacon-ui/tokens`
- Use tokens in CSS modules, inline styles, and global CSS

### CSS Modules Example
```css
.button {
  padding: var(--spacing-200) var(--spacing-400);
  background: var(--bg-primary);
  color: var(--fg-on-action);
  border-radius: var(--corner-radius-200);
  border: var(--border-width-50) solid var(--border-primary);
}
```

### Inline Styles Example
```tsx
<div style={{
  padding: 'var(--spacing-400)',
  backgroundColor: 'var(--bg-page-secondary)',
  color: 'var(--fg-neutral)',
  borderRadius: 'var(--corner-radius-400)'
}}>
```

## Token Naming Convention
- Figma variable names use forward slashes: `Foreground/Primary`
- CSS custom properties use hyphens: `--fg-primary`
- Follow the pattern: `--{category}-{name}` (e.g., `--fg-`, `--bg-`, `--spacing-`, `--border-`)

## Best Practices
- Prefer semantic tokens over raw color values (e.g., `var(--fg-primary)` not `#056dff`)
- Use spacing tokens consistently for all spacing needs
- Apply typography tokens through CSS classes or style objects, not inline font properties
- Use appropriate corner radius tokens based on element size and context
- Always check Figma for available tokens before creating custom values
- When a token doesn't exist, request it in Figma rather than hardcoding values

## Design Audit Instructions

When auditing a Figma design for token compliance:

### Audit Process
1. **Get design context** - Use `get_design_context` to retrieve the actual code/properties applied to elements
2. **Get variable definitions** - Use `get_variable_defs` to see available tokens (but note: this shows resolved values, not whether elements use tokens)
3. **Inspect actual properties** - Check the design context code for hardcoded hex colors, pixel values, etc.
4. **Compare against tokens** - Verify that properties use token references (e.g., `Foreground/White`) rather than hardcoded values (e.g., `#ffffff`)
5. **Check all elements** - Inspect text, icons, backgrounds, borders, spacing, and other visible properties
6. **Only check what's available** - Don't audit properties that don't exist in the design

### Response Format
Format audit results with clear visual indicators:

- ✅ **Pass** - Property correctly uses design tokens
- ❌ **Fail** - Property uses hardcoded values or doesn't use tokens

### Response Structure
Keep the audit response **very short** and focused:

1. **Passed items** (✅) - List properties that correctly use tokens
2. **Failed items** (❌) - List properties that fail with brief reason

Example format:
```
✅ Colors: All colors use semantic tokens (Foreground/Primary, Background/Success)
✅ Spacing: Padding and margins use spacing tokens (Spacing/200, Spacing/400)
❌ Typography: Font size hardcoded as 14px instead of Body2/Regular token
❌ Border Radius: Uses 4px instead of Corner Radius/200 token
```

### How to Detect Hardcoded Values

When reviewing design context code, look for:

**Hardcoded colors (FAIL):**
- Direct hex values: `#ffffff`, `#056dff`, `rgb(255, 255, 255)`
- Should use tokens instead: `Foreground/White`, `Border/Primary`

**Hardcoded spacing (FAIL):**
- Pixel values: `8px`, `16px`, `24px`
- Should use tokens instead: `Spacing/200`, `Spacing/400`, `Spacing/500`

**Hardcoded typography (FAIL):**
- Direct font sizes: `14px`, `font-size: 14`
- Should use typography tokens: `Body2/Medium`, `Body2/Regular`

**Hardcoded border radius (FAIL):**
- Pixel values: `8px`, `16px`
- Should use tokens: `Corner Radius/200`, `Corner Radius/400`

**Token usage (PASS):**
- References to Figma variables: `Foreground/White`, `Spacing/200`, `Body2/Medium`
- These appear as variable names in the design context, not resolved values

### Important Note
- `get_variable_defs` returns resolved values (e.g., `Foreground/White: "#ffffff"`) but doesn't indicate if elements use tokens
- Always check the actual design context code to see if properties reference tokens or have hardcoded values
- A hex value in variable definitions doesn't mean the design uses that token - it could be hardcoded

### What to Check
Only audit properties that are visible/applied in the design:
- Colors (fill, stroke, text) - check for hex codes vs token references
- Spacing (padding, margin, gap) - check for pixel values vs spacing tokens
- Typography (if text elements exist) - check for font-size values vs typography tokens
- Corner radius (if rounded elements exist) - check for pixel values vs radius tokens
- Border width (if borders exist) - check for pixel values vs border width tokens
- Icon sizes (if icons exist) - check for pixel values vs icon size tokens
- Backgrounds (if background colors exist) - check for hex codes vs background tokens

### Common Audit Mistakes

**Mistake: Assuming variable definitions mean token usage**
- ❌ Wrong: Seeing `Foreground/White: "#ffffff"` in variable definitions and assuming the design uses the token
- ✅ Correct: Check the actual design context code to see if text color is `Foreground/White` (token) or `#ffffff` (hardcoded)

**Mistake: Only checking variable definitions**
- ❌ Wrong: Only calling `get_variable_defs` and assuming all properties use tokens
- ✅ Correct: Call `get_design_context` to see actual property values applied to elements

**How to verify:**
1. Get design context code - look for actual property values in the code output
2. Search for hex codes (`#` followed by 6 hex digits) - these indicate hardcoded colors
3. Search for pixel values (`px` suffix) - these may indicate hardcoded spacing/sizing
4. Compare found values against available tokens - if a hex matches a token value but isn't referenced as a token, it's hardcoded
