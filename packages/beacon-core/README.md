# Beacon Design System

A comprehensive React design system with 9 production-ready components and design tokens. Built with TypeScript and token-driven architecture for consistency and scalability.

## Installation

```bash
npm install beacon-design-system
```

## Quick Start

### 1. Import Tokens CSS

Import the design tokens in your main CSS file or at the root of your application:

```tsx
import 'beacon-design-system/tokens';
```

Or import specific token files:

```tsx
import 'beacon-design-system/tokens/primitives';
import 'beacon-design-system/tokens/semantic';
import 'beacon-design-system/tokens/brand-light';
import 'beacon-design-system/tokens/brand-dark';
import 'beacon-design-system/tokens/responsive';
import 'beacon-design-system/tokens/effects';
import 'beacon-design-system/tokens/typography';
```

### 2. Wrap Your App with ThemeProvider

```tsx
import { ThemeProvider } from 'beacon-design-system';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" defaultHue="hue-sky">
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 3. Use Components

```tsx
import { Button, Card, Checkbox, Switch, Input, Avatar, Chip, Menu, RadioButton } from 'beacon-design-system';

function MyComponent() {
  return (
    <>
      <Button
        variant="filled"
        size="md"
        cornerRadius={2}
        hasStartIcon={false}
        hasEndIcon={false}
        fillContainer={false}
        justifyContent="center"
        state="default"
        theme="dark"
        hue="hue-sky"
      />
      <Checkbox checked={true} onChange={(checked) => console.log(checked)} />
      <Switch checked={false} onChange={(checked) => console.log(checked)} />
    </>
  );
}
```

## Components

- **Avatar** - User avatars with icon, text, or image support
- **Button** - Multiple variants (filled, tonal, outline, link) with sizes and states
- **Card** - Flexible card components (product, experience, info, generic)
- **Checkbox** - Accessible checkbox with label support
- **Chip** - Compact labels and tags
- **Input** - Form inputs with icons, labels, and error states
- **Menu** - Navigation menus for desktop, tablet, and mobile
- **Radio Button** - Radio button groups with label support
- **Switch** - Toggle switches with optional icons

## Design Tokens

Beacon Design System uses a comprehensive token system:

- **Primitives** - Base color, spacing, and typography values
- **Semantic** - Context-aware tokens (primary, success, warning, critical)
- **Brand** - Theme-specific tokens (light/dark)
- **Responsive** - Breakpoint-aware tokens for desktop, tablet, and mobile
- **Effects** - Shadows and visual effects
- **Typography** - Font families, sizes, weights, and line heights

## Theme Support

Beacon supports multiple themes and hue variants:

### Themes
- `light` - Light theme
- `dark` - Dark theme (default)

### Hue Variants
- `chromatic-prime` - Default chromatic palette
- `hue-sky` - Sky blue variant
- `hue-indigo` - Indigo variant

### Using Theme Context

```tsx
import { useTheme } from 'beacon-design-system';

function ThemeToggle() {
  const { theme, hue, setTheme, setHue, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type { 
  Theme, 
  HueVariant,
  ColorPrimitive,
  SemanticColor,
  SpacingToken,
  BackgroundToken,
  ForegroundToken,
  BorderToken
} from 'beacon-design-system';
```

## Accessibility

All components are built with accessibility in mind:
- WCAG 2.1 AA compliant
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Responsive Design

Components adapt seamlessly across breakpoints:
- Desktop (default)
- Tablet (max-width: 1024px)
- Mobile (max-width: 768px)

## Documentation

For detailed documentation, component APIs, and examples, visit:
https://beacon.uxraza.com/

## Version

Current version: **3.1.3**

## License

MIT

## Repository

https://github.com/raza-ahmed/beacon

