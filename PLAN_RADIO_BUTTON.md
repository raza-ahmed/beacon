# Plan: Radio Button Component Page

## Overview
Create a comprehensive documentation page for the Radio Button component following the established patterns from other component pages (Checkbox, Switch, etc.). The Radio Button component allows users to select a single option from a set of mutually exclusive options.

## Figma Reference
- Design: https://www.figma.com/design/16M5gfw4D2vKg0pI2FXr5D/Beacon-Design-System?node-id=676-4124&m=dev

## Component Features (from Figma)
- **States**: Default, Hovered, Focused, Pressed (Selected), Disabled
- **Selection**: Selected and Unselected states
- **Label**: Text label support ("Select Me")
- **Visual States**:
  - Unselected: Circle with border (varies by state)
  - Selected: Filled circle with inner white circle (varies by state)
  - Focus states: Outer ring indicator
  - Disabled: Reduced opacity and disabled colors

## Implementation Tasks

### 1. Create RadioButtonPreview Component
**File**: `src/components/RadioButtonPreview.tsx`

**Props**:
- `selected?: boolean` - Whether the radio button is selected
- `status?: "default" | "hovered" | "focused" | "pressed" | "disabled"` - Interactive state
- `label?: string` - Text label (default: "Select Me")
- `theme?: "light" | "dark"` - Theme variant
- `hue?: HueVariant` - Color hue variant

**Implementation Details**:
- Render a circular radio button element (20px size)
- Show different border styles based on selected state and status
- When selected: thick border (6px) with primary color, inner white circle
- When unselected: thin border (1px) with neutral color
- Handle all 5 states (default, hovered, focused, pressed, disabled)
- Display label text with appropriate colors based on state
- Support focus ring indicator for focused states
- Use design tokens for all colors, spacing, and borders

### 2. Create RadioButtonControls Component
**File**: `src/components/RadioButtonControls.tsx`

**Props**:
- `selected: boolean`
- `status: "default" | "hovered" | "focused" | "pressed" | "disabled"`
- `label: string`
- `theme: "light" | "dark"`
- `hue: HueVariant`
- `onSelectedChange: (selected: boolean) => void`
- `onStatusChange: (status: "default" | "hovered" | "focused" | "pressed" | "disabled") => void`
- `onLabelChange: (label: string) => void`
- `onThemeChange: (theme: "light" | "dark") => void`
- `onHueChange: (hue: HueVariant) => void`

**Controls Layout**:
- Row 1: Status dropdown (full width) - "Default", "Hovered", "Focused", "Pressed", "Disabled"
- Row 2: Selected toggle and Label input field
- Row 3: Color section (Theme and Hue dropdowns)

### 3. Create Radio Button Page
**File**: `src/app/components/radio-button/page.tsx`

**Page Structure**:

#### 3.1 Overview Section
- Brief description of radio buttons
- Use cases: single selection from mutually exclusive options
- Key differences from checkboxes (single vs multiple selection)

#### 3.2 Interactive Playground Section
- `RadioButtonControls` component
- `RadioButtonPreview` component
- Live code generation showing current props
- Copy button for generated code

#### 3.3 Anatomy Section
- Visual diagram showing:
  - Radio button circle (20px)
  - Label text
  - Focus ring (when applicable)
- Label each part with descriptions and measurements

#### 3.4 Variants & States Section
- **Unselected States**:
  - Default: Thin border, neutral color
  - Hovered: Thin border, darker neutral
  - Focused: Thin border with focus ring
  - Pressed: Background fill variation
  - Disabled: Light gray, reduced opacity
- **Selected States**:
  - Default: Thick border (6px), primary color, white inner circle
  - Hovered: Darker primary color
  - Focused: Primary color with focus ring
  - Pressed: Darker primary color
  - Disabled: Light primary color, reduced opacity
- Display each state in a card with title, description, and preview

#### 3.5 Usage Guidelines Section
- **Do**:
  - Use radio buttons for mutually exclusive options
  - Use radio buttons when only one selection is allowed
  - Group related radio buttons together
  - Provide clear, descriptive labels
  - Use radio button groups for 2-7 options
  - Ensure one option is selected by default when appropriate
- **Don't**:
  - Don't use radio buttons for multiple selections (use checkboxes)
  - Don't use radio buttons for immediate actions (use buttons)
  - Don't use radio buttons without labels
  - Don't use too many radio buttons in a single group (consider dropdown)
  - Don't disable radio buttons without explaining why
- **Accessibility**:
  - Always associate radio buttons with labels
  - Use proper HTML structure or ARIA attributes
  - Ensure sufficient color contrast
  - Provide keyboard navigation (Arrow keys to navigate, Space to select)
  - Use semantic HTML (`<input type="radio">` or proper ARIA roles)
  - Group related radio buttons with `<fieldset>` and `<legend>`
  - Ensure radio buttons are large enough to be easily clickable (minimum 20px)

#### 3.6 API Reference Section
- **RadioButtonProps Interface**:
  ```typescript
  interface RadioButtonProps {
    selected?: boolean;
    status?: "default" | "hovered" | "focused" | "pressed" | "disabled";
    label?: string;
    onChange?: (selected: boolean) => void;
  }
  ```
- Props table with:
  - `selected`: boolean, default: false
  - `status`: "default" | "hovered" | "focused" | "pressed" | "disabled", default: "default"
  - `label`: string, default: "Select Me"
  - `onChange`: (selected: boolean) => void
- Copy button for API reference code

#### 3.7 Code Examples Section
- **Basic Radio Button**: `<RadioButton />`
- **Radio Button with Label**: `<RadioButton label="Option 1" />`
- **Selected Radio Button**: `<RadioButton selected label="Selected" />`
- **Disabled Radio Button**: `<RadioButton selected disabled label="Disabled" />`
- **Radio Button Group**: Multiple radio buttons in a group
- **Radio Button with Different States**: Examples showing status prop usage
- Each example with copy button

### 4. Update Sidebar Navigation
**File**: `src/components/Sidebar.tsx`
- Radio Button is already listed in the navigation (added previously)
- Verify the link is correct: `/components/radio-button`

### 5. Export Components
**File**: `src/components/index.ts`
- Add exports for `RadioButtonPreview` and `RadioButtonControls`

### 6. Add CSS Styles
**File**: `src/app/globals.css`
- Add styles for `.ds-radio-button-*` classes following the consolidated pattern:
  - `.ds-radio-button-playground`
  - `.ds-radio-button-playground-divider`
  - `.ds-radio-button-preview-section`
  - `.ds-radio-button-preview`
  - `.ds-radio-button-preview-code`
  - `.ds-radio-button-code-copy` (use consolidated base class)
  - `.ds-radio-button-controls`
  - `.ds-radio-button-control-group`
  - `.ds-radio-button-control-field`
  - `.ds-radio-button-control-label`
  - `.ds-radio-button-control-select`
  - `.ds-radio-button-anatomy-diagram`
  - `.ds-radio-button-variants-grid`
  - `.ds-radio-button-variant-card`

### 7. State Management
- Use `useState` for component config
- Track `selected`, `status`, `label`, `theme`, `hue`
- Use `copied` and `copiedExample` states for copy button feedback
- Generate code dynamically based on config

### 8. Code Generation Function
- `generateRadioButtonCode(config: RadioButtonConfig): string`
- Only include props that differ from defaults
- Format props with proper indentation
- Return clean, readable JSX code

## Design Token Usage
- Border colors: `var(--border-*)`, `var(--border-primary-*)`
- Border widths: `var(--border-width-25)`, `var(--border-width-150)`
- Text colors: `var(--fg-*)`, `var(--fg-disabled)`
- Spacing: `var(--spacing-*)`
- Corner radius: `var(--corner-radius-full)` for circular shape
- Focus ring: Use appropriate focus indicator tokens

## Key Differences from Checkbox
- Radio buttons are for single selection (mutually exclusive)
- Radio buttons are always circular (checkboxes are square)
- Radio buttons typically appear in groups
- Radio buttons don't have an indeterminate state
- Radio buttons use a filled circle with inner white circle when selected (vs checkmark for checkboxes)

## Testing Checklist
- [ ] All 5 states render correctly (default, hovered, focused, pressed, disabled)
- [ ] Selected and unselected states work properly
- [ ] Label text displays correctly
- [ ] Focus ring appears for focused states
- [ ] Disabled state shows reduced opacity
- [ ] Theme and hue changes apply correctly
- [ ] Code generation produces correct output
- [ ] Copy buttons work for all code examples
- [ ] Interactive playground updates in real-time
- [ ] All CSS classes are properly applied
- [ ] Page is accessible and keyboard navigable

## Notes
- Follow the exact same structure and patterns as Checkbox and Switch pages
- Ensure consistency in styling, spacing, and component organization
- Use the same consolidated CSS patterns for maintainability
- Radio buttons should be 20px in size (same as medium checkbox)
- The selected state uses a 6px border (thick) vs 1px for unselected (thin)

