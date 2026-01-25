# Beacon Design System - Agent Instructions

This document provides specific instructions for AI agents working on the Beacon Design System. Follow these workflows and standards to ensure consistency and quality.

## Table of Contents

- [Token Workflow](#token-workflow)
- [Icon Workflow](#icon-workflow)
- [Component Creation Workflow](#component-creation-workflow)
- [Documentation Standards](#documentation-standards)
- [File Structure & Conventions](#file-structure--conventions)
- [Validation & Quality Checks](#validation--quality-checks)
- [NPM Package Workflow](#npm-package-workflow)
- [Common Tasks](#common-tasks)

---

## Token Workflow

### When to Build Tokens

Always run token build scripts when:
- Figma token files in `Design Tokens Figma/` are updated
- New token files are added
- Token values or names change
- Before building documentation site or NPM packages

### Token Build Process

1. **Build tokens for documentation site:**
   ```bash
   npm run build:tokens
   ```
   - Generates CSS files in `src/tokens/generated/`
   - Updates TypeScript types in `src/tokens/types.ts`

2. **Build tokens for NPM package:**
   ```bash
   cd packages/beacon-ui
   npm run build:tokens
   ```
   - Generates CSS files in `packages/beacon-ui/tokens/generated/`

3. **Validate CSS variables:**
   ```bash
   npm run validate:css-vars
   ```
   - Ensures all token references are valid
   - Checks for missing or broken CSS variables

### Token File Structure

Tokens are exported from Figma and stored in `Design Tokens Figma/`:
- `Primitives.Value.tokens.json` - Base values (colors, spacing, typography)
- `Semantic.*.tokens.json` - Semantic tokens (multiple hue variants)
- `Brand.*.tokens.json` - Theme tokens (light/dark)
- `Responsive.*.tokens.json` - Breakpoint tokens (desktop, tablet, mobile)
- `effect.styles.tokens.json` - Shadow and effect tokens
- `text.styles.tokens.json` - Typography style tokens

### Token Usage Rules

- **Never use hardcoded values** (hex codes, pixel values, durations)
- **Always reference tokens** via CSS variables: `var(--token-name)`
- **Use TypeScript types** from `src/tokens/types.ts` for type safety
- **Follow token naming** exactly as defined in Figma

---

## Icon Workflow

### Adding New Icons

The project uses an automation script to convert SVGs into React components.

1. **Place SVGs**: Drop your `.svg` files into the `/icons` directory at the root.
2. **Run Preparation**: Run `npm run prepare:icons`.
   - This sanitizes the name (PascalCase + "Icon" suffix).
   - Converts SVG attributes to React-compatible JSX.
   - Updates the library files and documentation gallery automatically.
3. **Build Package**: Run `npm run build:icons` to update the distribution files.
4. **Cleanup**: Remove the source SVGs from the `/icons` folder to avoid duplication on next run.

---

## Component Creation Workflow

### Step-by-Step Process

1. **Check Figma First**
   - Verify component exists in Figma
   - Review all variants, states, and props
   - Note token usage and naming conventions
   - Document Figma node ID for reference

2. **Create Component File**
   - Location: `packages/beacon-ui/src/components/[ComponentName].tsx`
   - Use TypeScript with strict types
   - Follow existing component patterns
   - Use tokens for all styling (no hardcoded values)

3. **Export from Package Index**
   - Add export to `packages/beacon-ui/src/index.ts`
   - Ensure proper TypeScript types are exported

4. **Create Documentation Page**
   - Location: `src/app/components/[component-name]/page.tsx`
   - Use the component command documentation as reference
   - Include all required sections (see Documentation Standards)

5. **Create Preview & Control Components**
   - Preview: `src/components/[ComponentName]Preview.tsx`
   - Controls: `src/components/[ComponentName]Controls.tsx`
   - Follow patterns from existing components (Button, Card, etc.)

6. **Add to Component Index**
   - Update `src/app/page.tsx` if component list exists
   - Add navigation link in `src/components/Sidebar.tsx` if needed

### Component Code Standards

- **Pure React components** - no side effects in render
- **TypeScript interfaces** for all props
- **Token-based styling** - use CSS variables
- **Accessibility** - ARIA attributes, keyboard support
- **Named exports** - not default exports
- **WCAG 2.1 AA compliance** - contrast, focus states, etc.

---

## Documentation Standards

### Required Documentation Sections

Each component documentation page (`src/app/components/[name]/page.tsx`) must include:

1. **Overview**
   - Component name and purpose
   - Brief description of use cases

2. **Interactive Playground**
   - Live preview with controls
   - Real-time code generation
   - Theme and hue switching

3. **Anatomy**
   - Visual breakdown of component parts
   - Token references for each part

4. **Variants & States**
   - All available variants
   - All available states
   - Visual examples of each

5. **Usage Guidelines**
   - Do's and Don'ts
   - Accessibility considerations
   - Best practices

6. **API Reference**
   - Complete TypeScript interface
   - Props table with types, defaults, descriptions
   - Copyable type definitions

7. **Usage Examples**
   - Copyable, runnable code snippets
   - Common use cases
   - All examples must use tokens

### Documentation Code Requirements

- **All code examples must be valid TypeScript**
- **All examples must use tokens** (no hardcoded values)
- **All examples must be copyable** and runnable
- **Use named exports** in examples
- **Include imports** in code examples
- **Syntax highlighting** with theme-aware styling

### Documentation Patterns

Follow the structure from `src/app/components/button/page.tsx`:
- Use `PageLayout` with table of contents
- Use `CodeCopyButton` for all code blocks
- Use `SyntaxHighlighter` with theme-aware syntax theme
- Use `useTheme` hook for theme/hue switching
- Generate code dynamically from component config

---

## File Structure & Conventions

### Directory Structure

```
beacon/
├── Design Tokens Figma/          # Figma-exported tokens (source of truth)
├── packages/
│   ├── beacon-ui/                 # Main component package
│   │   ├── src/
│   │   │   ├── components/        # React components
│   │   │   ├── providers/         # Theme provider
│   │   │   └── tokens/            # Token types
│   │   └── tokens/               # Generated CSS tokens
│   └── beacon-icons/              # Icon package
├── scripts/                       # Build and utility scripts
├── src/
│   ├── app/                       # Next.js documentation site
│   │   ├── components/            # Component doc pages
│   │   ├── foundations/           # Foundation doc pages
│   │   └── ...
│   ├── components/                # Documentation components
│   ├── tokens/                    # Token types and generated CSS
│   └── utils/                     # Utility functions
└── public/                        # Static assets
```

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `Card.tsx`)
- **Documentation pages**: kebab-case (`button/page.tsx`, `card/page.tsx`)
- **Preview components**: `[Component]Preview.tsx`
- **Control components**: `[Component]Controls.tsx`
- **Tokens**: kebab-case CSS variables (`--token-name`)

### File Organization

- One component per file
- Related components in same directory
- Shared utilities in `src/utils/`
- Type definitions in `src/tokens/types.ts`

---

## Validation & Quality Checks

### Before Committing

1. **Run token validation:**
   ```bash
   npm run validate:css-vars
   ```

2. **Check documentation sync:**
   ```bash
   npm run check:docs
   ```
   - Verifies component API matches documentation
   - Checks for missing or outdated docs

3. **Run linter:**
   ```bash
   npm run lint
   ```

4. **Build tokens:**
   ```bash
   npm run build:tokens
   ```

5. **Test build:**
   ```bash
   npm run build
   ```

### Quality Checklist

- [ ] All tokens are referenced (no hardcoded values)
- [ ] TypeScript types are correct and exported
- [ ] Component matches Figma definition
- [ ] Documentation includes all required sections
- [ ] Code examples are copyable and runnable
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] All variants and states documented
- [ ] Preview and control components work correctly

---

## NPM Package Workflow

### Building Packages

1. **Sync version:**
   ```bash
   npm run sync:version
   ```
   - Updates version across all packages
   - Updates version data constants

2. **Build component package:**
   ```bash
   npm run build:package
   ```
   - Compiles TypeScript
   - Generates type definitions
   - Builds tokens
   - Outputs to `packages/beacon-ui/dist/`

3. **Build icons package:**
   ```bash
   npm run build:icons
   ```
   - Compiles icon components
   - Outputs to `packages/beacon-icons/dist/`

### Publishing Packages

1. **Publish component package:**
   ```bash
   npm run publish:package
   ```
   - Syncs version
   - Builds package
   - Publishes to NPM

2. **Publish icons package:**
   ```bash
   npm run publish:icons
   ```
   - Syncs version
   - Builds package
   - Publishes to NPM

### Version Management

- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Current version: 3.5.9
- Update in `src/constants/version.ts`
- Run `sync:version` to update all package.json files

---

## Common Tasks

### Adding a New Component

1. Check Figma for component definition
2. Create component in `packages/beacon-ui/src/components/`
3. Export from `packages/beacon-ui/src/index.ts`
4. Create documentation page in `src/app/components/[name]/page.tsx`
5. Create preview and control components
6. Add to navigation/sidebar
7. Test in documentation site
8. Update component list if needed

### Updating Tokens from Figma

1. Export tokens from Figma to `Design Tokens Figma/`
2. Run `npm run build:tokens`
3. Run `npm run validate:css-vars`
4. Check for breaking changes in token names
5. Update components if token names changed
6. Update documentation if needed
7. Test documentation site

### Updating Component Documentation

1. Review component code for changes
2. Update API reference section
3. Update examples if props changed
4. Update variants/states if changed
5. Run `npm run check:docs` to verify sync
6. Test interactive playground

### Fixing Token Issues

1. Check token file in `Design Tokens Figma/`
2. Verify token name matches Figma exactly
3. Run `npm run build:tokens`
4. Check generated CSS in `src/tokens/generated/`
5. Verify CSS variable name format
6. Check TypeScript types in `src/tokens/types.ts`
7. Run `npm run validate:css-vars`

---

## Important Reminders

- **Figma is the source of truth** - always check Figma first
- **Never hardcode values** - always use tokens
- **Documentation must be copyable** - all examples must work
- **TypeScript types are required** - no `any` types
- **Accessibility is mandatory** - WCAG 2.1 AA compliance
- **Test before committing** - run validation scripts
- **Follow existing patterns** - consistency is key

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev                    # Start documentation site
npm run build:tokens          # Build tokens
npm run validate:css-vars     # Validate CSS variables
npm run check:docs            # Check documentation sync

# Building
npm run build                 # Build documentation site
npm run build:package         # Build component package
npm run build:icons           # Build icons package

# Publishing
npm run sync:version          # Sync version across packages
npm run publish:package       # Publish component package
npm run publish:icons         # Publish icons package
```

### Key File Locations

- Components: `packages/beacon-ui/src/components/`
- Documentation: `src/app/components/`
- Tokens (source): `Design Tokens Figma/`
- Tokens (generated): `src/tokens/generated/`
- Token types: `src/tokens/types.ts`
- Preview components: `src/components/*Preview.tsx`
- Control components: `src/components/*Controls.tsx`

---

For more details, see:
- `.cursor/rules/design-system-project.mdc` - Project rules
- `.cursor/commands/component-command-documentation.md` - Component doc command
- `.cursor/commands/site-command-documentation.md` - Site command
- `README.md` - Project overview
