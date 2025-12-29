# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.7] - 2025-12-29

### Changed
- Menu component desktop variant now uses `height: "100%"` by default to fill container height instead of fixed `600px`
- Custom height can still be set via the `style` prop to override the default behavior

## [3.1.6] - 2025-12-29

### Added
- Optional `state` prop to Button component for controlled state management (default, hovered, focused, pressed)
- Optional `status` prop to Switch, Checkbox, and RadioButton components for controlled state management
- Components now support both controlled (via props) and uncontrolled (internal state) modes
- Exported status/state types: `ButtonState`, `SwitchStatus`, `CheckboxStatus`, `RadioButtonStatus`

### Fixed
- Menu component now uses public `Switch` component API instead of internal `SwitchPreview`
- Menu component accepts optional `avatarImageUrl` prop instead of hardcoded image path
- Menu component properly uses theme context for theme and hue values
- Fixed nested button hydration error in Switch component wrapper

### Changed
- Menu component falls back to `UserPersonIcon` when `avatarImageUrl` is not provided
- Button, Switch, Checkbox, and RadioButton components now only update internal state when status/state prop is not provided (controlled pattern)

## [3.1.5] - 2025-12-29

### Fixed
- Menu component now uses public `Switch` component API instead of internal `SwitchPreview`
- Menu component accepts optional `avatarImageUrl` prop instead of hardcoded image path
- Menu component properly uses theme context for theme and hue values

### Changed
- Menu component falls back to `UserPersonIcon` when `avatarImageUrl` is not provided

## [3.1.4] - 2025-12-29

### Added
- Initial npm package release as `beacon-ui`
- README.md with installation and usage instructions
- CHANGELOG.md for version tracking
- Comprehensive documentation for all components
- TypeScript type exports for design tokens
- 9 production-ready components:
  - Avatar
  - Button
  - Card
  - Checkbox
  - Chip
  - Input
  - Menu
  - Radio Button
  - Switch
- ThemeProvider for theme and hue management
- Complete design token system:
  - Primitives (colors, spacing, typography)
  - Semantic tokens (primary, success, warning, critical)
  - Brand tokens (light/dark themes)
  - Responsive tokens (desktop, tablet, mobile)
  - Effect tokens (shadows)
  - Typography tokens
- TypeScript support with full type definitions
- Icon component library
- Support for multiple themes (light/dark)
- Support for multiple hue variants (chromatic-prime, hue-sky, hue-indigo)

### Features
- Token-driven architecture
- WCAG 2.1 AA accessibility compliance
- Responsive design support
- Full TypeScript support
- React 18 and 19 compatibility

---

## Version History

- **3.1.4** - Initial release of `beacon-ui` package
