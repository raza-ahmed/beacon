# Beacon Design System

A comprehensive React design system with 9 production-ready components and design tokens. Built with TypeScript and token-driven architecture for consistency and scalability.

## Installation

```bash
npm install beacon-ui
```

## Quick Start

### 1. Import Tokens CSS

Import the design tokens in your main CSS file or at the root of your application:

```tsx
import 'beacon-ui/tokens';
```

Or import specific token files:

```tsx
import 'beacon-ui/tokens/primitives';
import 'beacon-ui/tokens/semantic';
import 'beacon-ui/tokens/brand-light';
import 'beacon-ui/tokens/brand-dark';
import 'beacon-ui/tokens/responsive';
import 'beacon-ui/tokens/effects';
import 'beacon-ui/tokens/typography';
```

### 2. Wrap Your App with ThemeProvider

```tsx
import { ThemeProvider } from 'beacon-ui';

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
import { Button, Checkbox, Switch, Input, Avatar, Chip } from 'beacon-ui';

function MyComponent() {
  return (
    <>
      <Button onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
      
      <Checkbox 
        checked={true} 
        onChange={(checked) => console.log(checked)} 
        label="Accept terms"
        showLabel
      />
      
      <Switch 
        checked={false} 
        onChange={(checked) => console.log(checked)} 
      />
    </>
  );
}
```

## Getting Started

### Basic Button Usage

```tsx
import { Button } from 'beacon-ui';

function MyComponent() {
  return (
    <Button onClick={() => alert('Hello!')}>
      Click Me
    </Button>
  );
}
```

### Button with Icons

```tsx
import { Button } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

function SearchButton() {
  return (
    <Button 
      startIcon={<SearchIcon size="xs" />}
      onClick={() => console.log('Search')}
    >
      Search
    </Button>
  );
}
```

### Button Variants

```tsx
import { Button } from 'beacon-ui';

function ButtonVariants() {
  return (
    <>
      <Button variant="filled">Filled</Button>
      <Button variant="tonal">Tonal</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Link</Button>
    </>
  );
}
```

### Button Sizes

```tsx
import { Button } from 'beacon-ui';

function ButtonSizes() {
  return (
    <>
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </>
  );
}
```

### Button States

```tsx
import { Button } from 'beacon-ui';

function ButtonStates() {
  return (
    <>
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </>
  );
}
```

### Form Input

```tsx
import { Input } from 'beacon-ui';
import { SearchIcon } from 'beacon-icons';

function SearchInput() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      label="Search"
      placeholder="Enter search term"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      startIcon={<SearchIcon size={16} />}
    />
  );
}
```

### Checkbox

```tsx
import { Checkbox } from 'beacon-ui';

function TermsCheckbox() {
  const [accepted, setAccepted] = useState(false);
  
  return (
    <Checkbox
      checked={accepted}
      onChange={setAccepted}
      label="I accept the terms and conditions"
      showLabel
    />
  );
}
```

### Switch

```tsx
import { Switch } from 'beacon-ui';

function NotificationSwitch() {
  const [enabled, setEnabled] = useState(false);
  
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      aria-label="Enable notifications"
    />
  );
}
```

### Avatar

```tsx
import { Avatar } from 'beacon-ui';

function UserAvatar() {
  return (
    <>
      <Avatar type="icon" size="md" color="primary" />
      <Avatar type="text" initials="JD" size="md" color="primary" />
      <Avatar type="image" imageUrl="/avatar.jpg" size="md" />
    </>
  );
}
```

### Chip

```tsx
import { Chip } from 'beacon-ui';
import { ListDetailsIcon } from 'beacon-icons';

function Tags() {
  return (
    <>
      <Chip label="React" color="primary" />
      <Chip label="TypeScript" color="success" />
      <Chip 
        label="Design System" 
        color="neutral"
        icon={<ListDetailsIcon size={20} />}
      />
    </>
  );
}
```

## Common Patterns

### Form with Validation

```tsx
import { Input, Button } from 'beacon-ui';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    // Submit form
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError('');
        }}
        showError={!!error}
        errorMessage={error}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Theme Toggle

```tsx
import { useTheme, Button } from 'beacon-ui';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button onClick={toggleTheme}>
      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </Button>
  );
}
```

### Accessible Form Controls

```tsx
import { Checkbox, RadioButton, Switch } from 'beacon-ui';

function SettingsForm() {
  const [notifications, setNotifications] = useState(false);
  const [selectedOption, setSelectedOption] = useState('option1');
  
  return (
    <form>
      <Switch
        checked={notifications}
        onChange={setNotifications}
        aria-label="Enable email notifications"
      />
      
      <RadioButton
        selected={selectedOption === 'option1'}
        onChange={() => setSelectedOption('option1')}
        label="Option 1"
        showLabel
        name="options"
      />
      
      <RadioButton
        selected={selectedOption === 'option2'}
        onChange={() => setSelectedOption('option2')}
        label="Option 2"
        showLabel
        name="options"
      />
    </form>
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

## Component APIs

### Button

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "tonal" | "outline" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  cornerRadius?: 0 | 1 | 2 | 3 | 4 | 5;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fillContainer?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}
```

### Checkbox

```tsx
interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  showLabel?: boolean;
}
```

### Switch

```tsx
interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  showIcons?: boolean;
}
```

### Input

```tsx
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  size?: "sm" | "md" | "lg";
  status?: "default" | "active";
  showLabel?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  placeholderIcon?: React.ReactNode;
  showError?: boolean;
  errorMessage?: string;
  numberPrefix?: string;
  rounded?: boolean;
  iconOnly?: boolean;
}
```

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
import { useTheme } from 'beacon-ui';

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
  ButtonProps,
  CheckboxProps,
  SwitchProps,
  InputProps,
  AvatarProps,
  ChipProps,
  Theme, 
  HueVariant,
  ColorPrimitive,
  SemanticColor,
  SpacingToken,
  BackgroundToken,
  ForegroundToken,
  BorderToken
} from 'beacon-ui';
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

## Assets (Images)

The package includes static assets (images) for avatars and previews. These are located in `assets/` directory.

**Note:** Background patterns are now CSS-based and don't require image files. See the [Background Patterns documentation](/utility/bg-patterns) for details.

### Automatic Setup

Add a postinstall script to your `package.json`:

```json
{
  "scripts": {
    "postinstall": "mkdir -p public/images/avatars public/images/preview && cp -r node_modules/beacon-ui/assets/avatars/* public/images/avatars/ && cp -r node_modules/beacon-ui/assets/preview/* public/images/preview/"
  }
}
```

See `assets/README.md` for more details.

## Troubleshooting

### Components not styling correctly

Make sure you've imported the tokens CSS:

```tsx
import 'beacon-ui/tokens';
```

### Theme not applying

Ensure your app is wrapped with `ThemeProvider`:

```tsx
import { ThemeProvider } from 'beacon-ui';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      {/* Your components */}
    </ThemeProvider>
  );
}
```

### TypeScript errors

All component props extend standard HTML element types, so you can use any standard HTML attributes:

```tsx
<Button 
  onClick={handleClick}
  className="my-button"
  id="submit-btn"
  aria-label="Submit form"
>
  Submit
</Button>
```

### Icons not showing

Icons are in a separate package. Install and import them:

```bash
npm install beacon-icons
```

```tsx
import { SearchIcon } from 'beacon-icons';

<Button startIcon={<SearchIcon size="xs" />}>
  Search
</Button>
```

## Documentation

For detailed documentation, component APIs, and examples, visit:
https://beacon.uxraza.com/

## Version

Current version: **3.1.5**

## License

MIT

## Repository

https://github.com/raza-ahmed/beacon
