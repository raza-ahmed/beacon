# NPM Package Setup Checklist

## Project Summary

**Beacon Design System** is a comprehensive design system with 9 production-ready components and design tokens. The system is now available as an npm package (`@beacon/design-system`) for use across multiple projects (dashboard, website, etc.).

### Current Structure
- **Documentation Site**: Next.js app at root (`src/app/`, `src/components/`)
- **NPM Package**: Located in `packages/beacon-core/`
- **Version**: 3.1.0 (aligned with design system version 3.01)
- **Package Name**: `@beacon/design-system`

### Included Components
- Avatar
- Button
- Card
- Checkbox
- Chip
- Input
- Menu
- Radio Button
- Switch

### Included Foundations
- Design Tokens (Colors, Spacing, Themes)
- Typography
- Responsiveness
- Accessibility

---

## Setup Steps for Projects Using This Package

### 1. Install the Package

```bash
npm install @beacon/design-system
```

### 2. Import Tokens CSS

In your main CSS file or `_app.tsx` / `layout.tsx`:

```tsx
import '@beacon/design-system/tokens';
```

Or import specific token files:

```tsx
import '@beacon/design-system/tokens/primitives';
import '@beacon/design-system/tokens/semantic';
import '@beacon/design-system/tokens/brand-light';
import '@beacon/design-system/tokens/brand-dark';
import '@beacon/design-system/tokens/responsive';
import '@beacon/design-system/tokens/effects';
import '@beacon/design-system/tokens/typography';
```

### 3. Wrap Your App with ThemeProvider

```tsx
import { ThemeProvider } from '@beacon/design-system';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" defaultHue="hue-sky">
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 4. Use Components

```tsx
import { Button, Card, Checkbox, Switch } from '@beacon/design-system';

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
    </>
  );
}
```

### 5. Access Theme Context (Optional)

```tsx
import { useTheme } from '@beacon/design-system';

function MyComponent() {
  const { theme, hue, setTheme, setHue, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

---

## Update Workflow

### When Design System is Updated

1. **Update Design System**
   - Make changes to components, tokens, or providers
   - Update version in `packages/beacon-core/package.json` (e.g., 3.1.0 → 3.1.1)

2. **Build the Package**
   ```bash
   npm run build:package
   ```
   This will:
   - Compile TypeScript to `packages/beacon-core/dist/`
   - Generate tokens to `packages/beacon-core/tokens/generated/`

3. **Test Locally (Optional)**
   ```bash
   cd packages/beacon-core
   npm link
   cd ../../your-project
   npm link @beacon/design-system
   ```

4. **Publish to NPM**
   ```bash
   npm run publish:package
   ```
   Or manually:
   ```bash
   cd packages/beacon-core
   npm publish --access public
   ```

5. **Update Consuming Projects**
   ```bash
   cd your-project
   npm update @beacon/design-system
   ```

6. **Test in Consuming Projects**
   - Verify components still work
   - Check for breaking changes
   - Update component usage if needed

---

## Additional Steps

### Version Management

- Use semantic versioning (MAJOR.MINOR.PATCH)
- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Testing Before Publishing

1. Build the package: `npm run build:package`
2. Check `packages/beacon-core/dist/` contains compiled files
3. Check `packages/beacon-core/tokens/generated/` contains CSS files
4. Verify `package.json` `files` field includes correct paths
5. Test with `npm publish --dry-run`

### Troubleshooting

**Issue**: Components not rendering correctly
- **Solution**: Ensure tokens CSS is imported: `import '@beacon/design-system/tokens'`

**Issue**: Theme not working
- **Solution**: Wrap app with `ThemeProvider` component

**Issue**: TypeScript errors
- **Solution**: Ensure `@types/react` and `@types/react-dom` are installed in consuming project

**Issue**: Build fails
- **Solution**: Check that all dependencies are installed in `packages/beacon-core/`
- Run `npm install` in `packages/beacon-core/` directory

**Issue**: Tokens not generating
- **Solution**: Ensure `Design Tokens Figma/` directory exists at project root
- Run `npm run build:tokens` from package directory

### Package Structure

```
packages/beacon-core/
├── src/
│   ├── components/     # Reusable components
│   ├── providers/      # ThemeProvider
│   ├── tokens/         # Token types
│   ├── icons/          # Icon components
│   └── index.ts        # Main exports
├── tokens/
│   └── generated/      # Generated CSS files
├── dist/                # Compiled JavaScript (after build)
├── package.json
└── tsconfig.json
```

### Files Included in NPM Package

The `package.json` `files` field controls what gets published:
- `dist/` - Compiled TypeScript
- `tokens/` - Generated CSS token files

---

## Quick Reference

### Build Commands
- `npm run build:package` - Build the npm package
- `npm run publish:package` - Publish to npm
- `npm run build:tokens` - Generate tokens (from package directory)

### Import Paths
- Components: `@beacon/design-system`
- Tokens CSS: `@beacon/design-system/tokens`
- Types: `@beacon/design-system` (TypeScript types)

### Current Version
- Package: 3.1.0
- Design System: 3.01

---

## Notes

- The documentation site remains at the project root and is separate from the npm package
- Preview components were renamed to their base names (ButtonPreview → Button)
- All `@/` path aliases were converted to relative paths in the package
- Components use ThemeProvider context for theme and hue values
- Token generation requires `Design Tokens Figma/` directory at project root

