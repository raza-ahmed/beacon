/**
 * Token Build Script
 *
 * Transforms Figma-exported DTCG tokens into:
 * - CSS custom properties organized by layer
 * - TypeScript type definitions
 */

import * as fs from "fs";
import * as path from "path";

// Paths
const TOKENS_DIR = path.join(process.cwd(), "Design Tokens Figma");
const OUTPUT_DIR = path.join(process.cwd(), "src/tokens/generated");
const TYPES_OUTPUT = path.join(process.cwd(), "src/tokens/types.ts");

// Token types from DTCG spec
type TokenValue = string | number | boolean | TokenValue[] | { [key: string]: TokenValue };

interface Token {
  $type?: string;
  $value?: TokenValue;
  [key: string]: Token | string | TokenValue | undefined;
}

interface TokenFile {
  [key: string]: Token;
}

// Store all resolved primitive values for reference resolution
const primitiveValues: Map<string, string> = new Map();
const semanticValues: Map<string, string> = new Map();

/**
 * Convert a token path to a CSS variable name
 * e.g., "Color.Purple.100" -> "--color-purple-100"
 */
function tokenPathToCssVar(tokenPath: string): string {
  return (
    "--" +
    tokenPath
      .toLowerCase()
      .replace(/\./g, "-")
      .replace(/_/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  );
}

/**
 * Resolve a token reference like "{Color.Gray.500}" to its actual value
 */
function resolveReference(
  ref: string,
  valueStore: Map<string, string>,
  fallbackStore?: Map<string, string>
): string {
  // Extract the path from {Path.To.Token}
  const match = ref.match(/^\{(.+)\}$/);
  if (!match) return ref;

  const tokenPath = match[1];
  const cssVarName = tokenPathToCssVar(tokenPath);

  // Check if we have a resolved value
  if (valueStore.has(tokenPath)) {
    return `var(${cssVarName})`;
  }

  if (fallbackStore?.has(tokenPath)) {
    return `var(${cssVarName})`;
  }

  // For primitives, return the var reference
  return `var(${cssVarName})`;
}

/**
 * Check if a value is a token reference
 */
function isReference(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("{") && value.endsWith("}");
}

/**
 * Recursively extract tokens from a nested object
 */
function extractTokens(
  obj: TokenFile,
  parentPath: string = "",
  tokens: Map<string, { type: string; value: TokenValue }> = new Map()
): Map<string, { type: string; value: TokenValue }> {
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;

    if (value && typeof value === "object" && "$value" in value) {
      // This is a token leaf node
      tokens.set(currentPath, {
        type: (value as Token).$type || "unknown",
        value: (value as Token).$value as TokenValue,
      });
    } else if (value && typeof value === "object" && !("$type" in value)) {
      // This is a nested group, recurse
      extractTokens(value as TokenFile, currentPath, tokens);
    }
  }

  return tokens;
}

/**
 * Convert a token value to CSS
 */
function tokenValueToCss(
  value: TokenValue,
  type: string,
  valueStore: Map<string, string>,
  fallbackStore?: Map<string, string>
): string {
  if (typeof value === "string") {
    if (isReference(value)) {
      return resolveReference(value, valueStore, fallbackStore);
    }
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  // Handle shadow type (array of shadow objects)
  if (type === "shadow" && Array.isArray(value)) {
    return value
      .map((shadow) => {
        const s = shadow as { offsetX: string; offsetY: string; blur: string; spread: string; color: string };
        const color = isReference(s.color) ? resolveReference(s.color, valueStore, fallbackStore) : s.color;
        return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${color}`;
      })
      .join(", ");
  }

  // Handle typography type
  if (type === "typography" && typeof value === "object" && !Array.isArray(value)) {
    // Typography tokens are composites - we'll handle them separately
    return JSON.stringify(value);
  }

  return String(value);
}

/**
 * Read and parse a JSON token file
 */
function readTokenFile(filename: string): TokenFile {
  const filepath = path.join(TOKENS_DIR, filename);
  const content = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(content);
}

/**
 * Generate CSS for primitive tokens
 */
function generatePrimitivesCss(): string {
  const primitives = readTokenFile("Primitives.Value.tokens.json");
  const tokens = extractTokens(primitives);
  const lines: string[] = ["/* Primitive tokens - raw values */", ":root {"];

  for (const [tokenPath, { type, value }] of tokens) {
    const cssVar = tokenPathToCssVar(tokenPath);
    let cssValue = tokenValueToCss(value, type, primitiveValues);

    // Normalize font weight tokens to numeric values for CSS consumption.
    // Figma exports these as labels (e.g., "Regular", "SemiBold"), but CSS expects numbers.
    if (
      typeof value === "string" &&
      !isReference(value) &&
      cssVar.startsWith("--fonts-") &&
      cssVar.includes("-weight-")
    ) {
      const normalized = value.toLowerCase().replace(/\s+/g, "");
      if (normalized.includes("bold") && !normalized.includes("semi")) {
        cssValue = "700";
      } else if (normalized.includes("semibold")) {
        cssValue = "600";
      } else if (normalized.includes("medium")) {
        cssValue = "500";
      } else if (normalized.includes("regular")) {
        cssValue = "400";
      }
    }

    // Store for later reference resolution
    if (typeof value === "string" && !isReference(value)) {
      primitiveValues.set(tokenPath, cssValue);
    }

    lines.push(`  ${cssVar}: ${cssValue};`);
  }

  lines.push("}");
  return lines.join("\n");
}

/**
 * Hue variant configuration
 */
const HUE_VARIANTS = [
  { name: "chromatic-prime", file: "Semantic.Chromatic Prime.tokens.json", isDefault: true },
  { name: "hue-sky", file: "Semantic.Hue Sky.tokens.json", isDefault: false },
  { name: "hue-indigo", file: "Semantic.Hue Indigo.tokens.json", isDefault: false },
] as const;

/**
 * Generate CSS for all semantic token hue variants
 * Tokens that differ between hues get data-hue selectors
 * Shared tokens go in :root
 */
function generateSemanticCss(): string {
  // Load all hue variant files
  const hueTokens = HUE_VARIANTS.map((hue) => ({
    ...hue,
    tokens: extractTokens(readTokenFile(hue.file)),
  }));

  // Get the default (chromatic-prime) tokens as baseline
  const defaultTokens = hueTokens.find((h) => h.isDefault)!.tokens;

  // Identify which tokens differ between hue variants
  const differingTokenPaths = new Set<string>();
  const sharedTokenPaths = new Set<string>();

  for (const [tokenPath] of defaultTokens) {
    // Skip Font tokens - handled in typography.css
    if (tokenPath.startsWith("Font.")) continue;

    // Check if this token differs across hue variants
    const values = hueTokens.map((h) => {
      const token = h.tokens.get(tokenPath);
      return token ? JSON.stringify(token.value) : null;
    });

    const uniqueValues = new Set(values.filter(Boolean));
    if (uniqueValues.size > 1) {
      differingTokenPaths.add(tokenPath);
    } else {
      sharedTokenPaths.add(tokenPath);
    }
  }

  const lines: string[] = ["/* Semantic tokens - all hue variants */", ""];

  // Generate hue-specific CSS for each variant
  for (const hue of hueTokens) {
    const selector = hue.isDefault
      ? `:root, [data-hue="${hue.name}"]`
      : `[data-hue="${hue.name}"]`;

    lines.push(`/* ${hue.name} */`);
    lines.push(`${selector} {`);

    for (const tokenPath of differingTokenPaths) {
      const token = hue.tokens.get(tokenPath);
      if (!token) continue;

      const cssVar = tokenPathToCssVar(tokenPath);
      const cssValue = tokenValueToCss(token.value, token.type, primitiveValues);
      lines.push(`  ${cssVar}: ${cssValue};`);

      // Store semantic values from default hue for brand token resolution
      if (hue.isDefault) {
        semanticValues.set(tokenPath, cssValue);
      }
    }

    lines.push("}");
    lines.push("");
  }

  // Generate shared tokens (same across all hues)
  lines.push("/* Shared semantic tokens (same across all hues) */");
  lines.push(":root {");

  for (const tokenPath of sharedTokenPaths) {
    const token = defaultTokens.get(tokenPath);
    if (!token) continue;

    const cssVar = tokenPathToCssVar(tokenPath);
    const cssValue = tokenValueToCss(token.value, token.type, primitiveValues);
    lines.push(`  ${cssVar}: ${cssValue};`);

    // Store semantic values for brand token resolution
    semanticValues.set(tokenPath, cssValue);
  }

  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate CSS for brand theme tokens
 */
function generateBrandCss(theme: "light" | "dark", filename: string): string {
  const brand = readTokenFile(filename);
  const tokens = extractTokens(brand);
  const selector = theme === "light" ? ':root, [data-theme="light"]' : '[data-theme="dark"]';
  const lines: string[] = [`/* Brand tokens - ${theme} theme */`, `${selector} {`];

  for (const [tokenPath, { type, value }] of tokens) {
    // Transform token paths for brand tokens
    const cssVarBase = tokenPath
      .toLowerCase()
      .replace(/\./g, "-")
      .replace(/_/g, "-")
      .replace(/-+/g, "-");

    // Map brand token categories to cleaner names
    let cssVar = `--${cssVarBase}`;
    if (tokenPath.startsWith("Background.")) {
      cssVar = `--bg-${cssVarBase.replace("background-", "")}`;
    } else if (tokenPath.startsWith("Foreground.")) {
      cssVar = `--fg-${cssVarBase.replace("foreground-", "")}`;
    } else if (tokenPath.startsWith("Border.")) {
      cssVar = `--border-${cssVarBase.replace("border-", "")}`;
    } else if (tokenPath.startsWith("Static.")) {
      cssVar = `--static-${cssVarBase.replace("static-", "")}`;
    } else if (tokenPath.startsWith("Utilities.")) {
      cssVar = `--util-${cssVarBase.replace("utilities-", "")}`;
    }

    const cssValue = tokenValueToCss(value, type, semanticValues, primitiveValues);
    lines.push(`  ${cssVar}: ${cssValue};`);
  }

  lines.push("}");
  return lines.join("\n");
}

/**
 * Generate CSS for responsive tokens
 */
function generateResponsiveCss(): string {
  const desktop = readTokenFile("Responsive.Desktop.tokens.json");
  const tablet = readTokenFile("Responsive.Tablet.tokens.json");
  const mobile = readTokenFile("Responsive.Mobile.tokens.json");

  const desktopTokens = extractTokens(desktop);
  const tabletTokens = extractTokens(tablet);
  const mobileTokens = extractTokens(mobile);

  const lines: string[] = ["/* Responsive tokens */"];

  // Desktop (default)
  lines.push(":root {");
  for (const [tokenPath, { type, value }] of desktopTokens) {
    // Skip visibility and non-dimension tokens for CSS vars
    if (type === "boolean") continue;

    let cssVar = tokenPathToCssVar(tokenPath);

    // Map font tokens to cleaner names
    if (tokenPath.startsWith("Fonts.Heading.")) {
      const match = tokenPath.match(/Fonts\.Heading\.(H\d)\.(.+)/);
      if (match) {
        const level = match[1].toLowerCase();
        const prop = match[2].toLowerCase().replace(/_/g, "-");
        cssVar = `--heading-${level}-${prop}`;
      }
    } else if (tokenPath.startsWith("Fonts.Body.")) {
      const match = tokenPath.match(/Fonts\.Body\.(.+)\.(.+)/);
      if (match) {
        const size = match[1].toLowerCase().replace(/_/g, "-");
        const prop = match[2].toLowerCase().replace(/_/g, "-");
        cssVar = `--body-${size}-${prop}`;
      }
    }

    const cssValue = tokenValueToCss(value, type, primitiveValues);
    lines.push(`  ${cssVar}: ${cssValue};`);
  }
  lines.push("}");

  // Tablet
  lines.push("\n@media (max-width: 1024px) {");
  lines.push("  :root {");
  for (const [tokenPath, { type, value }] of tabletTokens) {
    if (type === "boolean") continue;

    let cssVar = tokenPathToCssVar(tokenPath);

    if (tokenPath.startsWith("Fonts.Heading.")) {
      const match = tokenPath.match(/Fonts\.Heading\.(H\d)\.(.+)/);
      if (match) {
        const level = match[1].toLowerCase();
        const prop = match[2].toLowerCase().replace(/_/g, "-");
        cssVar = `--heading-${level}-${prop}`;
      }
    } else if (tokenPath.startsWith("Fonts.Body.")) {
      const match = tokenPath.match(/Fonts\.Body\.(.+)\.(.+)/);
      if (match) {
        const size = match[1].toLowerCase().replace(/_/g, "-");
        const prop = match[2].toLowerCase().replace(/_/g, "-");
        cssVar = `--body-${size}-${prop}`;
      }
    }

    const cssValue = tokenValueToCss(value, type, primitiveValues);
    lines.push(`    ${cssVar}: ${cssValue};`);
  }
  lines.push("  }");
  lines.push("}");

  // Mobile
  lines.push("\n@media (max-width: 768px) {");
  lines.push("  :root {");
  for (const [tokenPath, { type, value }] of mobileTokens) {
    if (type === "boolean") continue;

    let cssVar = tokenPathToCssVar(tokenPath);

    if (tokenPath.startsWith("Fonts.Heading.")) {
      const match = tokenPath.match(/Fonts\.Heading\.(H\d)\.(.+)/);
      if (match) {
        const level = match[1].toLowerCase();
        const prop = match[2].toLowerCase().replace(/_/g, "-");
        cssVar = `--heading-${level}-${prop}`;
      }
    } else if (tokenPath.startsWith("Fonts.Body.")) {
      const match = tokenPath.match(/Fonts\.Body\.(.+)\.(.+)/);
      if (match) {
        const size = match[1].toLowerCase().replace(/_/g, "-");
        const prop = match[2].toLowerCase().replace(/_/g, "-");
        cssVar = `--body-${size}-${prop}`;
      }
    }

    const cssValue = tokenValueToCss(value, type, primitiveValues);
    lines.push(`    ${cssVar}: ${cssValue};`);
  }
  lines.push("  }");
  lines.push("}");

  return lines.join("\n");
}

/**
 * Generate CSS for effect tokens (shadows)
 */
function generateEffectsCss(): string {
  const effects = readTokenFile("effect.styles.tokens.json");
  const tokens = extractTokens(effects);
  const lines: string[] = ["/* Effect tokens - shadows */", ":root {"];

  for (const [tokenPath, { type, value }] of tokens) {
    const cssVar = tokenPathToCssVar(tokenPath);
    const cssValue = tokenValueToCss(value, type, semanticValues, primitiveValues);
    lines.push(`  ${cssVar}: ${cssValue};`);
  }

  lines.push("}");
  return lines.join("\n");
}

/**
 * Generate CSS for typography tokens
 */
function generateTypographyCss(): string {
  const typography = readTokenFile("text.styles.tokens.json");
  const tokens = extractTokens(typography);
  const lines: string[] = ["/* Typography tokens */"];

  // Generate CSS custom properties for typography
  lines.push(":root {");
  lines.push("  /* Font families from semantic tokens */");
  lines.push('  --font-primary: "IBM Plex Serif", serif;');
  lines.push('  --font-secondary: "DM Sans", sans-serif;');
  lines.push("");
  lines.push("  /* Font weight tokens mapped from primitives */");
  lines.push("  --font-weight-regular: var(--fonts-dm-sans-weight-regular);");
  lines.push("  --font-weight-medium: var(--fonts-dm-sans-weight-medium);");
  lines.push("  --font-weight-semibold: var(--fonts-dm-sans-weight-semibold);");
  lines.push("  --font-weight-bold: var(--fonts-dm-sans-weight-bold);");
  lines.push("  --font-weight-primary-regular: var(--fonts-ibm-plex-serif-weight-regular);");
  lines.push("  --font-weight-primary-medium: var(--fonts-ibm-plex-serif-weight-medium);");
  lines.push("  --font-weight-primary-semibold: var(--fonts-ibm-plex-serif-weight-semibold);");
  // IBM Plex Serif export doesn't include a bold token in primitives - fall back to 700.
  lines.push("  --font-weight-primary-bold: var(--font-weight-bold);");
  lines.push("  --font-weight-secondary-regular: var(--fonts-dm-sans-weight-regular);");
  lines.push("  --font-weight-secondary-medium: var(--fonts-dm-sans-weight-medium);");
  lines.push("  --font-weight-secondary-semibold: var(--fonts-dm-sans-weight-semibold);");
  lines.push("  --font-weight-secondary-bold: var(--fonts-dm-sans-weight-bold);");
  lines.push("}");

  // Generate utility classes for typography styles
  lines.push("\n/* Typography utility classes */");

  for (const [tokenPath, { value }] of tokens) {
    if (typeof value !== "object" || Array.isArray(value)) continue;

    const typographyValue = value as {
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      letterSpacing?: string;
      lineHeight?: string;
      textTransform?: string;
      textDecoration?: string;
    };

    const className = tokenPath.toLowerCase().replace(/\./g, "-");

    lines.push(`.text-${className} {`);

    if (typographyValue.fontFamily) {
      const fontRef = typographyValue.fontFamily;
      if (fontRef.includes("IBM")) {
        lines.push("  font-family: var(--font-primary);");
      } else {
        lines.push("  font-family: var(--font-secondary);");
      }
    }

    if (typographyValue.fontWeight) {
      const weight = typographyValue.fontWeight;
      const isPrimaryFont = Boolean(typographyValue.fontFamily && typographyValue.fontFamily.includes("IBM"));
      const prefix = isPrimaryFont ? "primary" : "secondary";

      if (weight.includes("Bold")) {
        lines.push(`  font-weight: var(--font-weight-${prefix}-bold);`);
      } else if (weight.includes("Semibold") || weight.includes("SemiBold")) {
        lines.push(`  font-weight: var(--font-weight-${prefix}-semibold);`);
      } else if (weight.includes("Medium")) {
        lines.push(`  font-weight: var(--font-weight-${prefix}-medium);`);
      } else {
        lines.push(`  font-weight: var(--font-weight-${prefix}-regular);`);
      }
    }

    if (typographyValue.textTransform && typographyValue.textTransform !== "none") {
      lines.push(`  text-transform: ${typographyValue.textTransform};`);
    }

    if (typographyValue.textDecoration && typographyValue.textDecoration !== "none") {
      lines.push(`  text-decoration: ${typographyValue.textDecoration};`);
    }

    if (typographyValue.letterSpacing && typographyValue.letterSpacing !== "0%") {
      lines.push(`  letter-spacing: ${typographyValue.letterSpacing};`);
    }

    lines.push("}");
  }

  return lines.join("\n");
}

/**
 * Generate TypeScript type definitions
 */
function generateTypes(): string {
  const primitives = readTokenFile("Primitives.Value.tokens.json");
  const semantic = readTokenFile("Semantic.Chromatic Prime.tokens.json");
  const brandLight = readTokenFile("Brand.Light.tokens.json");

  const lines: string[] = [
    "/**",
    " * Auto-generated token types",
    " * Do not edit directly - regenerate with `npm run build:tokens`",
    " */",
    "",
  ];

  // Generate color primitive types
  lines.push("export type ColorPrimitive =");
  const colorTokens = extractTokens(primitives.Color as TokenFile, "Color");
  const colorPaths = Array.from(colorTokens.keys()).map((p) => `  | "${p}"`);
  lines.push(colorPaths.join("\n") + ";");
  lines.push("");

  // Generate scale types
  lines.push("export type ScaleToken =");
  const scaleTokens = extractTokens(primitives.Scale as TokenFile, "Scale");
  const scalePaths = Array.from(scaleTokens.keys()).map((p) => `  | "${p}"`);
  lines.push(scalePaths.join("\n") + ";");
  lines.push("");

  // Generate semantic color types
  lines.push("export type SemanticColor =");
  const semanticColorTokens = extractTokens(semantic.Color as TokenFile, "Color");
  const semanticColorPaths = Array.from(semanticColorTokens.keys()).map((p) => `  | "${p}"`);
  lines.push(semanticColorPaths.join("\n") + ";");
  lines.push("");

  // Generate spacing types
  lines.push("export type SpacingToken =");
  const spacingTokens = extractTokens(semantic.Spacing as TokenFile, "Spacing");
  const spacingPaths = Array.from(spacingTokens.keys()).map((p) => `  | "${p}"`);
  lines.push(spacingPaths.join("\n") + ";");
  lines.push("");

  // Generate brand token types
  lines.push("export type BackgroundToken =");
  const bgTokens = extractTokens(brandLight.Background as TokenFile, "Background");
  const bgPaths = Array.from(bgTokens.keys()).map((p) => `  | "${p}"`);
  lines.push(bgPaths.join("\n") + ";");
  lines.push("");

  lines.push("export type ForegroundToken =");
  const fgTokens = extractTokens(brandLight.Foreground as TokenFile, "Foreground");
  const fgPaths = Array.from(fgTokens.keys()).map((p) => `  | "${p}"`);
  lines.push(fgPaths.join("\n") + ";");
  lines.push("");

  lines.push("export type BorderToken =");
  const borderTokens = extractTokens(brandLight.Border as TokenFile, "Border");
  const borderPaths = Array.from(borderTokens.keys()).map((p) => `  | "${p}"`);
  lines.push(borderPaths.join("\n") + ";");
  lines.push("");

  // Theme type
  lines.push('export type Theme = "light" | "dark";');
  lines.push("");

  // Hue type
  lines.push('export type HueVariant = "chromatic-prime" | "hue-sky" | "hue-indigo";');
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate index CSS that includes all token files.
 *
 * Important: Avoid CSS @import here. Next.js will bundle CSS from multiple files
 * into a single stylesheet, and any @import that is not at the very top of the
 * final stylesheet will be ignored by browsers.
 */
function generateIndexCss(parts: {
  primitivesCss: string;
  semanticCss: string;
  brandLightCss: string;
  brandDarkCss: string;
  responsiveCss: string;
  effectsCss: string;
  typographyCss: string;
}): string {
  return [
    "/* Design System Tokens - Auto-generated */",
    "/* Do not edit directly - regenerate with npm run build:tokens */",
    "",
    parts.primitivesCss.trim(),
    "",
    parts.semanticCss.trim(),
    "",
    parts.brandLightCss.trim(),
    "",
    parts.brandDarkCss.trim(),
    "",
    parts.responsiveCss.trim(),
    "",
    parts.effectsCss.trim(),
    "",
    parts.typographyCss.trim(),
    "",
  ].join("\n");
}

/**
 * Main build function
 */
async function build() {
  console.log("Building design tokens...\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate CSS files in order (primitives must be first to populate the value store)
  console.log("Generating primitives.css...");
  const primitivesCss = generatePrimitivesCss();
  fs.writeFileSync(path.join(OUTPUT_DIR, "primitives.css"), primitivesCss);

  console.log("Generating semantic.css (all hue variants)...");
  const semanticCss = generateSemanticCss();
  fs.writeFileSync(path.join(OUTPUT_DIR, "semantic.css"), semanticCss);

  console.log("Generating brand-light.css...");
  const brandLightCss = generateBrandCss("light", "Brand.Light.tokens.json");
  fs.writeFileSync(path.join(OUTPUT_DIR, "brand-light.css"), brandLightCss);

  console.log("Generating brand-dark.css...");
  const brandDarkCss = generateBrandCss("dark", "Brand.Dark.tokens.json");
  fs.writeFileSync(path.join(OUTPUT_DIR, "brand-dark.css"), brandDarkCss);

  console.log("Generating responsive.css...");
  const responsiveCss = generateResponsiveCss();
  fs.writeFileSync(path.join(OUTPUT_DIR, "responsive.css"), responsiveCss);

  console.log("Generating effects.css...");
  const effectsCss = generateEffectsCss();
  fs.writeFileSync(path.join(OUTPUT_DIR, "effects.css"), effectsCss);

  console.log("Generating typography.css...");
  const typographyCss = generateTypographyCss();
  fs.writeFileSync(path.join(OUTPUT_DIR, "typography.css"), typographyCss);

  console.log("Generating index.css...");
  const indexCss = generateIndexCss({
    primitivesCss,
    semanticCss,
    brandLightCss,
    brandDarkCss,
    responsiveCss,
    effectsCss,
    typographyCss,
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.css"), indexCss);

  console.log("Generating types.ts...");
  const types = generateTypes();
  fs.writeFileSync(TYPES_OUTPUT, types);

  console.log("\nToken build complete!");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Types: ${TYPES_OUTPUT}`);
}

build().catch(console.error);

