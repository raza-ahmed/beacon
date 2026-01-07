/**
 * Token Build Script
 *
 * Transforms Figma-exported DTCG tokens into:
 * - CSS custom properties organized by layer
 * - TypeScript type definitions
 */

import * as fs from "fs";
import * as path from "path";

// Paths - support custom output directory via environment variable or CLI arg
// Find project root by looking for Design Tokens Figma directory
function findProjectRoot(): string {
  let currentDir = process.cwd();
  while (currentDir !== path.dirname(currentDir)) {
    const tokensDir = path.join(currentDir, "Design Tokens Figma");
    if (require("fs").existsSync(tokensDir)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return process.cwd(); // Fallback to current directory
}

const PROJECT_ROOT = findProjectRoot();
const TOKENS_DIR = path.join(PROJECT_ROOT, "Design Tokens Figma");
const OUTPUT_DIR_ARG = process.argv.find(arg => arg.startsWith("--output-dir="));
const OUTPUT_DIR = OUTPUT_DIR_ARG 
  ? path.resolve(process.cwd(), OUTPUT_DIR_ARG.split("=")[1])
  : path.join(PROJECT_ROOT, "src/tokens/generated");
const TYPES_OUTPUT_ARG = process.argv.find(arg => arg.startsWith("--types-output="));
const TYPES_OUTPUT = TYPES_OUTPUT_ARG
  ? path.resolve(process.cwd(), TYPES_OUTPUT_ARG.split("=")[1])
  : path.join(PROJECT_ROOT, "src/tokens/types.ts");

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
 * Convert font weight string to numeric value
 */
function fontWeightToNumeric(weight: string): string {
  const normalized = weight.toLowerCase().replace(/\s+/g, "");
  if (normalized.includes("bold") && !normalized.includes("semi")) {
    return "700";
  } else if (normalized.includes("semibold")) {
    return "600";
  } else if (normalized.includes("medium")) {
    return "500";
  } else if (normalized.includes("regular") || normalized.includes("normal")) {
    return "400";
  }
  return weight;
}

/**
 * Check if Font section has per-font structure (Font.Inter.Inter, Font.Inter.Weight)
 */
function hasPerFontStructure(fontSection: TokenFile): boolean {
  // Check if any direct child has both a name token and Weight subobject
  for (const [key, value] of Object.entries(fontSection)) {
    if (value && typeof value === "object" && !("$type" in value)) {
      const fontObj = value as TokenFile;
      // Check for font name token (e.g., Font.Inter.Inter) and Weight subobject
      if (fontObj[key] && fontObj.Weight) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Generate CSS for primitive tokens
 */
function generatePrimitivesCss(): string {
  const primitives = readTokenFile("Primitives.Value.tokens.json");
  const tokens = extractTokens(primitives);
  const lines: string[] = ["/* Primitive tokens - raw values */", ":root {"];

  // Check Font structure type
  const fontSection = primitives.Font as TokenFile | undefined;
  const isPerFontStructure = fontSection && hasPerFontStructure(fontSection);

  for (const [tokenPath, { type, value }] of tokens) {
    // Skip Font tokens - we'll handle them separately based on structure
    if (tokenPath.startsWith("Font.")) {
      continue;
    }

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
      cssValue = fontWeightToNumeric(value);
    }

    // Store for later reference resolution
    if (typeof value === "string" && !isReference(value)) {
      primitiveValues.set(tokenPath, cssValue);
    }

    lines.push(`  ${cssVar}: ${cssValue};`);
  }

  // Font key to Next.js variable mapping
  const fontVarMapping: Record<string, { variable: string; fallback: string }> = {
    "Inter": { variable: "--font-inter", fallback: "sans-serif" },
    "DM_Sans": { variable: "--font-dm-sans", fallback: "sans-serif" },
    "IBM_Plex_Serif": { variable: "--font-ibm-plex-serif", fallback: "serif" },
    "Geist_Mono": { variable: "--font-geist-mono", fallback: "monospace" },
  };

  // Handle Font tokens based on structure
  if (fontSection) {
    if (isPerFontStructure) {
      // Per-font structure: Font.Inter.Inter, Font.Inter.Weight.Regular, etc.
      for (const [fontKey, fontValue] of Object.entries(fontSection)) {
        if (!fontValue || typeof fontValue !== "object" || "$type" in fontValue) continue;

        const fontObj = fontValue as TokenFile;
        const fontKeyLower = fontKey.toLowerCase().replace(/_/g, "-");

        // Get font name from nested token (e.g., Font.Inter.Inter)
        const fontNameToken = fontObj[fontKey] as Token | undefined;
        if (fontNameToken && fontNameToken.$value) {
          const fontNameStr = String(fontNameToken.$value);
          const fontNameLower = fontNameStr.toLowerCase().replace(/\s+/g, "-");

          // Get Next.js font variable mapping
          const fontMapping = fontVarMapping[fontKey];
          const fontValue = fontMapping
            ? `var(${fontMapping.variable}), ${fontMapping.fallback}`
            : fontNameStr;

          // Generate font style variable: --fonts-inter-style-inter: var(--font-inter), sans-serif;
          const styleVar = `--fonts-${fontKeyLower}-style-${fontNameLower}`;
          lines.push(`  ${styleVar}: ${fontValue};`);
          primitiveValues.set(`Font.${fontKey}.${fontKey}`, fontValue);
        }

        // Get weights from Font.Inter.Weight
        const weightObj = fontObj.Weight as TokenFile | undefined;
        if (weightObj) {
          for (const [weightKey, weightValue] of Object.entries(weightObj)) {
            if (!weightValue || typeof weightValue !== "object" || !("$value" in weightValue)) continue;

            const weightToken = weightValue as Token;
            const weightKeyLower = weightKey.toLowerCase();
            const numericWeight = fontWeightToNumeric(String(weightToken.$value));

            // Generate weight variable: --fonts-inter-weight-regular: 400;
            const weightVar = `--fonts-${fontKeyLower}-weight-${weightKeyLower}`;
            lines.push(`  ${weightVar}: ${numericWeight};`);
            primitiveValues.set(`Font.${fontKey}.Weight.${weightKey}`, numericWeight);
          }
        }
      }
    } else {
      // Shared structure: Font.Style.Inter, Font.Weight.Regular (handled by extractTokens)
      const fontTokens = extractTokens(fontSection, "Font");
      for (const [tokenPath, { value }] of fontTokens) {
        const cssVar = tokenPathToCssVar(tokenPath);
        let cssValue = String(value);

        if (cssVar.includes("-weight-")) {
          cssValue = fontWeightToNumeric(cssValue);
        }

        lines.push(`  ${cssVar}: ${cssValue};`);
        primitiveValues.set(tokenPath, cssValue);
      }
    }
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
 * Resolve a font reference to CSS variable
 * e.g., "{Font.IBM_Plex_Serif.IBM_Plex_Serif}" -> "var(--fonts-ibm-plex-serif-style-ibm-plex-serif)"
 */
function resolveFontReference(ref: string): string {
  const match = ref.match(/^\{Font\.([^.]+)\.([^.]+)\}$/);
  if (!match) return ref;

  const fontKey = match[1].toLowerCase().replace(/_/g, "-");
  const fontName = match[2].toLowerCase().replace(/_/g, "-");
  return `var(--fonts-${fontKey}-style-${fontName})`;
}

/**
 * Resolve a font weight reference to CSS variable
 * e.g., "{Font.IBM_Plex_Serif.Weight.Semibold}" -> "var(--fonts-ibm-plex-serif-weight-semibold)"
 */
function resolveFontWeightReference(ref: string): string {
  const match = ref.match(/^\{Font\.([^.]+)\.Weight\.([^}]+)\}$/);
  if (!match) return ref;

  const fontKey = match[1].toLowerCase().replace(/_/g, "-");
  const weight = match[2].toLowerCase();
  return `var(--fonts-${fontKey}-weight-${weight})`;
}

/**
 * Generate font CSS variables from semantic Font section
 */
function generateFontVarsFromSemantic(fontSection: TokenFile): string[] {
  const lines: string[] = [];

  // Get Primary font config
  const primaryFamily = (fontSection.Primary as TokenFile)?.Family as Token;
  const primaryWeights = (fontSection.Primary as TokenFile)?.Weight as TokenFile;

  // Get Secondary font config
  const secondaryFamily = (fontSection.Secondary as TokenFile)?.Family as Token;
  const secondaryWeights = (fontSection.Secondary as TokenFile)?.Weight as TokenFile;

  if (primaryFamily?.$value) {
    const familyRef = String(primaryFamily.$value);
    lines.push(`  --font-primary: ${resolveFontReference(familyRef)};`);
  }

  if (secondaryFamily?.$value) {
    const familyRef = String(secondaryFamily.$value);
    lines.push(`  --font-secondary: ${resolveFontReference(familyRef)};`);
  }

  // Primary weights
  if (primaryWeights) {
    for (const [weightName, weightToken] of Object.entries(primaryWeights)) {
      if (weightToken && typeof weightToken === "object" && "$value" in weightToken) {
        const weightRef = String((weightToken as Token).$value);
        lines.push(`  --font-weight-primary-${weightName.toLowerCase()}: ${resolveFontWeightReference(weightRef)};`);
      }
    }
  }

  // Secondary weights
  if (secondaryWeights) {
    for (const [weightName, weightToken] of Object.entries(secondaryWeights)) {
      if (weightToken && typeof weightToken === "object" && "$value" in weightToken) {
        const weightRef = String((weightToken as Token).$value);
        lines.push(`  --font-weight-secondary-${weightName.toLowerCase()}: ${resolveFontWeightReference(weightRef)};`);
      }
    }
  }

  // Default weights (use secondary)
  if (secondaryWeights) {
    lines.push(`  --font-weight-regular: var(--font-weight-secondary-regular);`);
    lines.push(`  --font-weight-medium: var(--font-weight-secondary-medium);`);
    lines.push(`  --font-weight-semibold: var(--font-weight-secondary-semibold);`);
    lines.push(`  --font-weight-bold: var(--font-weight-secondary-bold);`);
  }

  return lines;
}

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
    rawFile: readTokenFile(hue.file),
  }));

  // Get the default (chromatic-prime) tokens as baseline
  const defaultHue = hueTokens.find((h) => h.isDefault)!;
  const defaultTokens = defaultHue.tokens;

  // Identify which tokens differ between hue variants (excluding Font)
  const differingTokenPaths = new Set<string>();
  const sharedTokenPaths = new Set<string>();

  for (const [tokenPath] of defaultTokens) {
    // Skip Font tokens - handled separately
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

  // Generate hue-specific CSS for each variant (including fonts)
  for (const hue of hueTokens) {
    const selector = hue.isDefault
      ? `:root, [data-hue="${hue.name}"]`
      : `[data-hue="${hue.name}"]`;

    lines.push(`/* ${hue.name} */`);
    lines.push(`${selector} {`);

    // Generate font variables for this hue
    const fontSection = hue.rawFile.Font as TokenFile | undefined;
    if (fontSection) {
      const fontLines = generateFontVarsFromSemantic(fontSection);
      lines.push(...fontLines);
    }

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

    const originalCssVar = tokenPathToCssVar(tokenPath);
    let cssVar = originalCssVar;

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
    // Also emit the canonical tokenPath var name so references like
    // {Fonts.Heading.H3.Text Size} -> var(--fonts-heading-h3-text-size) resolve correctly.
    if (cssVar !== originalCssVar) {
      lines.push(`  ${originalCssVar}: ${cssValue};`);
    }
  }
  lines.push("}");

  // Tablet
  lines.push("\n@media (max-width: 1024px) {");
  lines.push("  :root {");
  for (const [tokenPath, { type, value }] of tabletTokens) {
    if (type === "boolean") continue;

    const originalCssVar = tokenPathToCssVar(tokenPath);
    let cssVar = originalCssVar;

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
    if (cssVar !== originalCssVar) {
      lines.push(`    ${originalCssVar}: ${cssValue};`);
    }
  }
  lines.push("  }");
  lines.push("}");

  // Mobile
  lines.push("\n@media (max-width: 768px) {");
  lines.push("  :root {");
  for (const [tokenPath, { type, value }] of mobileTokens) {
    if (type === "boolean") continue;

    const originalCssVar = tokenPathToCssVar(tokenPath);
    let cssVar = originalCssVar;

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
    if (cssVar !== originalCssVar) {
      lines.push(`    ${originalCssVar}: ${cssValue};`);
    }
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
 * Load typography configuration
 */
function loadTypographyConfig(): {
  primary: { font: string; fallback: string };
  secondary: { font: string; fallback: string };
  availableFonts: Record<string, { name: string; fallback: string; cssVar: string }>;
} {
  const configPath = path.join(PROJECT_ROOT, "typography.config.json");
  if (!fs.existsSync(configPath)) {
    // Default fallback configuration
    return {
      primary: { font: "IBM_Plex_Serif", fallback: "serif" },
      secondary: { font: "DM_Sans", fallback: "sans-serif" },
      availableFonts: {
        Inter: { name: "Inter", fallback: "sans-serif", cssVar: "fonts-inter-style-inter" },
        DM_Sans: { name: "DM Sans", fallback: "sans-serif", cssVar: "fonts-dm-sans-style-dm-sans" },
        IBM_Plex_Serif: { name: "IBM Plex Serif", fallback: "serif", cssVar: "fonts-ibm-plex-serif-style-ibm-plex-serif" },
        Geist_Mono: { name: "Geist Mono", fallback: "monospace", cssVar: "fonts-geist-mono-style-geist-mono" },
      },
    };
  }
  const configContent = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(configContent);
}

/**
 * Get font CSS variable name from font key
 */
function getFontCssVar(fontKey: string, config: ReturnType<typeof loadTypographyConfig>): string {
  const font = config.availableFonts[fontKey];
  if (!font) {
    throw new Error(`Font "${fontKey}" not found in typography configuration`);
  }
  return `--${font.cssVar}`;
}

/**
 * Get font weight CSS variable name
 */
function getFontWeightCssVar(fontKey: string, weight: string): string {
  const fontKeyLower = fontKey.toLowerCase().replace(/_/g, "-");
  const weightLower = weight.toLowerCase();
  return `--fonts-${fontKeyLower}-weight-${weightLower}`;
}

/**
 * Generate CSS for typography tokens
 * Note: Font family and weight variables are now generated in semantic.css per hue variant
 */
function generateTypographyCss(): string {
  const typography = readTokenFile("text.styles.tokens.json");
  const tokens = extractTokens(typography);
  const config = loadTypographyConfig();
  const lines: string[] = ["/* Typography utility classes */", "/* Font variables (--font-primary, --font-secondary, weights) are defined in semantic.css per hue */"];

  // Helper function to determine if a font reference matches primary or secondary
  function isPrimaryFont(fontRef: string, config: ReturnType<typeof loadTypographyConfig>): boolean {
    if (!fontRef) return false;
    
    const tokenRef = isReference(fontRef) ? fontRef.slice(1, -1) : "";
    const fontName = !isReference(fontRef) ? fontRef : "";
    
    // Check if it references font.primary
    if (tokenRef.toLowerCase().includes("font.primary")) {
      return true;
    }
    
    // Check against configured primary font
    const primaryFontName = config.availableFonts[config.primary.font]?.name.toLowerCase() || "";
    const primaryFontKey = config.primary.font.toLowerCase().replace(/_/g, "");
    
    if (tokenRef.toLowerCase().includes(primaryFontKey) || 
        tokenRef.toLowerCase().includes(primaryFontName.replace(/\s+/g, "")) ||
        fontName.toLowerCase().includes(primaryFontName)) {
      return true;
    }
    
    return false;
  }

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
      const isPrimary = isPrimaryFont(fontRef, config);
      lines.push(`  font-family: var(--font-${isPrimary ? "primary" : "secondary"});`);
    }

    if (typographyValue.fontWeight) {
      const weight = typographyValue.fontWeight;
      // Determine if weight is primary or secondary based on the fontWeight reference itself
      const weightRef = isReference(weight) ? weight.slice(1, -1) : "";
      const isPrimaryWeight = isPrimaryFont(weight, config);
      
      // If fontWeight doesn't indicate, fall back to fontFamily check
      const isPrimaryFontFamily = typographyValue.fontFamily 
        ? isPrimaryFont(typographyValue.fontFamily, config)
        : false;
      
      // Use weight reference if available (it's more specific), otherwise fall back to fontFamily
      const prefix = isReference(weight) && weightRef ? (isPrimaryWeight ? "primary" : "secondary") : (isPrimaryFontFamily ? "primary" : "secondary");

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

    if (typographyValue.fontSize) {
      const size = typographyValue.fontSize;
      lines.push(`  font-size: ${isReference(size) ? resolveReference(size, primitiveValues, semanticValues) : size};`);
    }

    if (typographyValue.lineHeight) {
      const lh = typographyValue.lineHeight;
      lines.push(`  line-height: ${isReference(lh) ? resolveReference(lh, primitiveValues, semanticValues) : lh};`);
    }

    if (typographyValue.letterSpacing && typographyValue.letterSpacing !== "0%") {
      const ls = typographyValue.letterSpacing;
      lines.push(`  letter-spacing: ${isReference(ls) ? resolveReference(ls, primitiveValues, semanticValues) : ls};`);
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

