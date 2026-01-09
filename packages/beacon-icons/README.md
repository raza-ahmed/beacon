# Beacon Icons

Icon component library for Beacon Design System. A collection of 94+ SVG icons built as React components.

## Installation

```bash
npm install beacon-icons
```

## Usage

```tsx
import { SearchIcon, ChevronDownIcon, CheckIcon } from 'beacon-icons';

function MyComponent() {
  return (
    <div>
      <SearchIcon size="xs" />
      <ChevronDownIcon size="sm" />
      <CheckIcon size={20} />
    </div>
  );
}
```

## Icon Props

```tsx
interface IconProps {
  size?: number | "xs" | "sm" | "rg" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  color?: string;
}
```

## Available Icons

### Navigation
- `ChevronDownIcon`, `ChevronUpIcon`, `ChevronLeftIcon`, `ChevronRightIcon`
- `DownArrowIcon`, `UpArrowIcon`, `LeftArrowIcon`, `RightArrowIcon`
- `MenuIcon`, `CloseIcon`

### Actions
- `SearchIcon`, `SearchFilledIcon`
- `CheckIcon`, `CopyIcon`
- `DownloadIcon`, `LinkIcon`
- `DeleteBinIcon`, `DeleteBinFilledIcon`
- `PencilIcon`, `PencilFilledIcon`

### User & Profile
- `UserPersonIcon`, `UserPersonFilledIcon`
- `UserCircleIcon`, `UserCircleFilledIcon`

### UI Elements
- `ListIcon`, `ListCheckIcon`, `ListDetailsIcon`
- `GridUILayoutIcon`, `GridUILayoutFilledIcon`
- `SettingsGearIcon`, `SettingsGearFilledIcon`

### Communication
- `EmailEnvelopeIcon`, `EmailEnvelopeFilledIcon`
- `MessageDotsIcon`, `MessageDotsFilledIcon`
- `PhoneCallIcon`, `PhoneCallFilledIcon`

### Status & Alerts
- `AlertTriangleErrorIcon`, `AlertTriangleErrorFilledIcon`
- `CircleErrorIcon`, `CircleErrorFilledIcon`
- `ErrorSearchIcon`, `ErrorSearchFilledIcon`

### Time & Calendar
- `CalendarIcon`, `CalendarFilledIcon`
- `TimerAlarmIcon`, `TimerAlarmFilledIcon`

### Theme
- `SunIcon`, `SunFilledIcon`
- `MoonIcon`, `MoonFilledIcon`
- `PaletteIcon`, `PaletteFilledIcon`

### And many more...

## Size Options

Icons support both token-based sizes and numeric pixel values:

```tsx
// Token-based sizes
<SearchIcon size="xs" />   // Extra small
<SearchIcon size="sm" />    // Small
<SearchIcon size="rg" />    // Regular (default)
<SearchIcon size="md" />    // Medium
<SearchIcon size="lg" />    // Large
<SearchIcon size="xl" />    // Extra large
<SearchIcon size="2xl" />   // 2X large

// Numeric pixel values
<SearchIcon size={16} />
<SearchIcon size={24} />
```

## Styling

Icons use `currentColor` by default, so they inherit the text color:

```tsx
<div style={{ color: 'var(--fg-primary)' }}>
  <SearchIcon size="md" />
</div>
```

You can also override the color directly using the `color` prop:

```tsx
<SearchIcon size="md" color="#ff0000" />
<SearchIcon size="md" color="var(--fg-primary)" />
<SearchIcon size="md" color="rgb(255, 0, 0)" />
```

Or use className for custom styling:

```tsx
<SearchIcon size="md" className="my-icon-class" />
```

## Version

Current version: **3.1.6**

## License

MIT

## Repository

https://github.com/raza-ahmed/beacon

