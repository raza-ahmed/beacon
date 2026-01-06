# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.4.5] - 2026-01-06

### Added
- Typography configuration system via `typography.config.json` for customizable primary and secondary fonts
- Build script now dynamically maps fonts from configuration with configurable fallbacks

### Fixed
- TabItem Pill style now correctly handles disabled state with proper background color
- TabItem Pill padding and state transitions improved for consistent visual appearance

## [3.4.4] - 2026-01-05

### Changed
- Migrated background patterns from image-based to CSS-based implementation for better performance and scalability
- All pattern classes now use design token variables (`--util-pattern-ink-1` through `--util-pattern-ink-4`) for theme-aware styling
- Patterns automatically adapt to light and dark themes using the design token system

### Added
- Pattern ink color tokens (`Pattern_Ink_1` through `Pattern_Ink_4`) added to brand token collection for both light and dark themes
- New Utility section in documentation with Background Patterns page showcasing all available CSS patterns
- Comprehensive pattern library with 33 CSS-based patterns organized by category (Dot, Line, Grid, Ring, Wave, Texture, Shape)

### Removed
- Removed image-based pattern assets (`public/images/patterns/` and `packages/beacon-ui/assets/patterns/`)
- Removed pattern image copying from build scripts

### Fixed
- Pattern variables now persist across token rebuilds by being defined in source token JSON files
- All pattern classes updated to use token-based variables instead of hardcoded values

## [3.4.3] - 2026-01-04

### Added
- Tabs component with Tab and TabItem subcomponents for navigation and content organization
- TabItem supports horizontal and vertical placement, default and pill styles, multiple sizes, and icon support
- Tab component supports equal width distribution and configurable corner radius for pill style

## [3.4.2] - 2026-01-03

### Added
- Added `underline` prop to Button component for link variant to control text decoration

## [3.4.1] - 2026-01-03

### Changed
- Refactored inline CSS styles in changelog, how-to-use, and releases pages to use design system token variables and CSS utility classes
- Added CSS utility classes for common content patterns: `.ds-content__grid`, `.ds-content__card`, `.ds-content__flex`, `.ds-content__flex-wrap`, `.ds-content__version-badge`, `.ds-content__entry`, `.ds-content__code-container`, `.ds-content__code-wrapper`

### Fixed
- Fixed copy button vertical alignment in code blocks for install package sections
- Fixed button outline appearing momentarily on click - outline now only appears for keyboard navigation, not mouse clicks
- Improved consistency of styling across documentation pages by replacing inline styles with design system classes

## [3.4.0] - 2026-01-02

### Added
- Button Icon component for icon-only button interactions with support for all button variants, sizes, and states
- Motion animations system with comprehensive animation library including:
  - Professional animations (lift, shadow depth, border glow, smooth scale)
  - Playful animations (bounce, elastic, jelly, pop)
  - Minimal animations (fade, shift, soft glow, border fade)
  - 3D-focused animations (tilt, flip, parallax, depth glow)
- Motion guide documentation with usage guidelines, best practices, and implementation examples
- Icons are now available for search in design system website

## [3.3.1] - 2026-01-01

### Fixed
- Fixed Card component default background color from `bg-page-tertiary` to `bg-page-secondary`
- Fixed card preview elements in documentation to use `bg-page-secondary` instead of `bg-page-tertiary`
- Corrected API documentation to reflect correct default background color (`page-secondary` instead of `page-tertiary`)
- Fixed incorrect default values in API reference table (`showBgPattern` and `showOverlay` now correctly show `false`)

## [3.3.0] - 2025-01-02

### Added
- Typography implementation guide section in documentation with code examples and best practices
- Comprehensive usage examples for typography classes with copy-to-clipboard functionality
- Implementation patterns for combining typography classes with inline styles for color and spacing

### Changed
- Refactored all inline typography styles to use typography utility classes throughout documentation
- Improved typography class usage consistency across all component examples
- Updated build script to correctly determine font weight prefix based on fontWeight reference (not just fontFamily)
- Typography classes now properly handle H3 (secondary-semibold) and H6 (secondary-medium) font weights

### Fixed
- Fixed H3 typography class to use `font-weight-secondary-semibold` instead of `font-weight-primary-semibold`
- Fixed H6 typography class to use `font-weight-secondary-medium` instead of `font-weight-secondary-semibold`
- Corrected font weight determination logic in token build script to check fontWeight reference directly

## [3.2.0] - 2025-01-01

### Changed
- Simplified Card component usage examples for better developer experience
- Removed unnecessary wrapper divs from Card examples - Card's built-in flex layout handles spacing automatically
- Improved code examples to be cleaner and more minimal, following design system best practices
- Card examples now demonstrate cleaner, more maintainable code patterns

### Fixed
- Fixed missing line-height in typography previews across Card component examples
- Fixed image constraints in Product Card Pattern example - removed fixed width/height props for better flexibility

## [3.1.9] - 2025-12-29

### Added
- Menu component now supports render props for full customization:
  - `renderSwitch` - Customize or replace the Switch component with your own implementation
  - `renderToggleButton` - Customize or replace the toggle button (menu/close icon) with your own component
  - `renderButton` - Customize or replace the menu action button with your own component
- Menu component callback props for handling interactions:
  - `onSwitchChange` - Callback when Switch value changes
  - `onToggleButtonClick` - Callback when toggle button is clicked
  - `onButtonClick` - Callback when menu action button is clicked
- Exported render prop types: `SwitchRenderProps`, `ToggleButtonRenderProps`, `MenuButtonRenderProps`

### Changed
- Menu component now uses internal state management for Switch, allowing better control and customization
- Render props are optional - if not provided, Menu uses default components (backward compatible)

## [3.1.8] - 2025-12-29

### Fixed
- Button component now preserves variant colors (success, critical, warning) when in loading state
- Previously, buttons would revert to default/primary color when loading was enabled
- Loading state no longer overrides variant-specific colors

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
