# Beacon Design System

A comprehensive design system with production-ready React components, design tokens, and complete documentation. Built with TypeScript and token-driven architecture for consistency and scalability.

## 📦 NPM Packages

The design system is available as npm packages for use across multiple projects.

### Main Package: beacon-ui

```bash
npm install beacon-ui
```

### Icons Package: beacon-icons

```bash
npm install beacon-icons
```

### Quick Start

```tsx
// 1. Import tokens CSS
import 'beacon-ui/tokens';

// 2. Wrap your app with ThemeProvider
import { ThemeProvider, Button, Checkbox, Switch } from 'beacon-ui';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" defaultHue="hue-sky">
      <Button onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
      <Checkbox 
        checked={true} 
        onChange={(checked) => console.log(checked)} 
      />
      <Switch 
        checked={false} 
        onChange={(checked) => console.log(checked)} 
      />
    </ThemeProvider>
  );
}
```

### Package Information

**beacon-ui** (Components & Tokens)
- **Package Name**: `beacon-ui`
- **Version**: 3.7.3
- **NPM**: https://www.npmjs.com/package/beacon-ui
- **Documentation**: https://beacon.uxraza.com/

**beacon-icons** (Icon Components)
- **Package Name**: `beacon-icons`
- **Version**: 3.7.3
- **NPM**: https://www.npmjs.com/package/beacon-icons

### Included Components

- Avatar
- Button
- Button Icon
- Card
- Checkbox
- Chip
- Divider
- Input
- Menu
- Radio Button
- Select
- Slider
- Switch
- Tab
- Toast

### Features

- ✅ 15 production-ready components
- ✅ Complete design token system
- ✅ TypeScript support
- ✅ Theme support (light/dark)
- ✅ Multiple hue variants
- ✅ WCAG 2.1 AA accessibility
- ✅ Responsive design
- ✅ React 18 & 19 compatible

For detailed usage instructions, see the [package README](./packages/beacon-ui/README.md).

---

## 🎨 Design System Documentation

The complete design system documentation is available at:

**https://beacon.uxraza.com/**

The documentation site includes:
- Component playgrounds with live examples
- Design token reference
- Typography system
- Spacing scale
- Theme customization
- Accessibility guidelines
- Responsive breakpoints

### Running the Documentation Site Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The documentation site is built with Next.js and \ed as a static site.

---

## 🔧 Token Building

Design tokens are generated from Figma-exported JSON files using the Design Tokens Community Group (DTCG) format.

### Token Source

Tokens are exported from Figma and stored in the `Design Tokens Figma/` directory:
- `Primitives.Value.tokens.json` - Base color, spacing, and typography values
- `Semantic.*.tokens.json` - Context-aware semantic tokens (multiple hue variants)
- `Brand.*.tokens.json` - Theme-specific brand tokens (light/dark)
- `Responsive.*.tokens.json` - Breakpoint-specific tokens (desktop, tablet, mobile)
- `effect.styles.tokens.json` - Shadow and effect tokens
- `text.styles.tokens.json` - Typography style tokens

### Building Tokens

```bash
# Build tokens for documentation site
npm run build:tokens

# Build tokens for npm package
cd packages/beacon-ui
npm run build:tokens
```

The build script (`scripts/build-tokens.ts`) generates:
- CSS custom properties files in `src/tokens/generated/`
- TypeScript type definitions in `src/tokens/types.ts`

### Token Output

Generated files:
- `primitives.css` - Base token values
- `semantic.css` - Semantic tokens with hue variants
- `brand-light.css` - Light theme tokens
- `brand-dark.css` - Dark theme tokens
- `responsive.css` - Responsive breakpoint tokens
- `effects.css` - Shadow and effect tokens
- `typography.css` - Typography utility classes
- `index.css` - Combined token file

### Token Structure

Tokens follow a hierarchical structure:
- **Primitives**: Raw design values (colors, spacing, typography)
- **Semantic**: Context-aware tokens (primary, success, warning, critical)
- **Brand**: Theme-specific tokens (backgrounds, foregrounds, borders)
- **Responsive**: Breakpoint-aware tokens
- **Effects**: Visual effects (shadows)

---

## 📁 Project Structure

```
beacon/
├── Design Tokens Figma/     # Figma-exported token files
├── packages/
│   ├── beacon-ui/          # NPM package (beacon-ui)
│   │   ├── src/            # Source code
│   │   │   ├── components/ # React components
│   │   │   ├── providers/  # Theme provider
│   │   │   └── tokens/     # Token type definitions
│   │   ├── dist/           # Compiled output
│   │   ├── tokens/         # Generated CSS tokens
│   │   ├── assets/         # Static assets (images, etc.)
│   │   └── package.json
│   └── beacon-icons/       # NPM package (beacon-icons)
│       ├── src/            # Icon components
│       ├── dist/           # Compiled output
│       └── package.json
├── scripts/
│   ├── build-tokens.ts     # Token build script
│   ├── sync-version.ts     # Version synchronization
│   ├── generate-version-data.ts  # Version data generator
│   ├── copy-assets.ts      # Asset copying script
│   ├── prepare-icons.ts    # Icon automation script
│   └── deploy.ts           # Deployment script
├── src/
│   ├── app/                # Next.js app (documentation site)
│   │   ├── components/     # Component documentation pages
│   │   ├── foundations/    # Foundation documentation pages
│   │   ├── motion/         # Motion/animation pages
│   │   └── utility/        # Utility pages
│   ├── components/         # Documentation components
│   ├── constants/         # Constants (version data, etc.)
│   ├── hooks/             # Custom hooks
│   ├── providers/         # Theme provider
│   ├── tokens/            # Token types and generated CSS
│   └── utils/             # Utility functions
├── public/                 # Static assets
└── out/                    # Static export output
```

---

## 🚀 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/raza-ahmed/beacon.git
cd beacon

# Install dependencies
npm install

# Build tokens
npm run build:tokens

# Start development server
npm run dev
```

### Building the NPM Packages

```bash
# Build components package
npm run build:package

# Build icons package
npm run build:icons

# Prepare new icons from SVGs in /icons folder
npm run prepare:icons

# Publish components package
npm run publish:package

# Publish icons package
npm run publish:icons
```

The package build process:
1. Compiles TypeScript to JavaScript
2. Generates type definitions (.d.ts files)
3. Builds design tokens
4. Outputs to `packages/beacon-ui/dist/` and `packages/beacon-ui/tokens/`

---

## 📝 Versioning

The design system follows semantic versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Current version: **3.7.3**

---

## 🔗 Links

- **Documentation**: https://beacon.uxraza.com/
- **NPM Package**: https://www.npmjs.com/package/beacon-ui
- **GitHub**: https://github.com/raza-ahmed/beacon

---

## 📄 License

MIT

---

## 🤝 Contributing

This is a design system project. For issues, feature requests, or contributions, please open an issue or pull request on GitHub.

