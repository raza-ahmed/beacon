/**
 * Background pattern configurations
 * Patterns are CSS-based and use design tokens for theme-aware styling
 * 
 * @example
 * // Using patterns in React components
 * import { getPatternClassName } from 'beacon-ui/utils/patternPaths';
 * 
 * function MyComponent() {
 *   return (
 *     <div className={getPatternClassName('dot-node')}>
 *       Content with pattern background
 *     </div>
 *   );
 * }
 * 
 * @example
 * // Using patterns with CSS classes directly in HTML/JSX
 * <div className="dot-node">
 *   Content with pattern background
 * </div>
 * 
 * @example
 * // Using patterns in any container element
 * <section className="dot-subtle">
 *   <h2>Section Title</h2>
 *   <p>Content with subtle dot pattern background</p>
 * </section>
 * 
 * @example
 * // Combining patterns with other CSS classes
 * const patternClass = getPatternClassName('tex-woven');
 * const className = 'my-container ' + patternClass;
 * <div className={className}>
 *   Content with woven texture pattern
 * </div>
 * 
 * @remarks
 * All pattern classes are defined in the global CSS and use design tokens
 * (--pattern-ink-1 through --pattern-ink-4) for theme-aware styling.
 * Patterns automatically adapt to light and dark themes.
 * 
 * Available pattern categories:
 * - Dot: dot-subtle, dot-halftone, dot-polka, dot-stars, dot-node, dot-striped
 * - Line: line-vertical, line-horizontal, line-stacked, line-hashrate, line-diagonal
 * - Grid: grid-soft, grid-offset, grid-graph, grid-nested, grid-datacenter, grid-plus, grid-minimal-plus
 * - Ring: ring-concentric, ring-outline, ring-quarter, ring-orbital, ring-radar, ring-noise
 * - Wave: wave-scallop, wave-stripe
 * - Texture: tex-woven, tex-herringbone, tex-brick, tex-paper
 * - Shape: shape-checker, shape-triangle, shape-zigzag, shape-bracket
 */

export type PatternType =
  | "default"
  // CSS patterns - Dot
  | "dot-subtle"
  | "dot-halftone"
  | "dot-polka"
  | "dot-stars"
  | "dot-node"
  | "dot-striped"
  // CSS patterns - Line
  | "line-vertical"
  | "line-horizontal"
  | "line-stacked"
  | "line-hashrate"
  | "line-diagonal"
  // CSS patterns - Grid
  | "grid-soft"
  | "grid-offset"
  | "grid-graph"
  | "grid-nested"
  | "grid-datacenter"
  | "grid-plus"
  | "grid-minimal-plus"
  // CSS patterns - Ring
  | "ring-concentric"
  | "ring-outline"
  | "ring-quarter"
  | "ring-orbital"
  | "ring-radar"
  | "ring-noise"
  // CSS patterns - Wave
  | "wave-scallop"
  | "wave-stripe"
  // CSS patterns - Texture
  | "tex-woven"
  | "tex-herringbone"
  | "tex-brick"
  | "tex-paper"
  // CSS patterns - Shape
  | "shape-checker"
  | "shape-triangle"
  | "shape-zigzag"
  | "shape-bracket"
  // Legacy pattern names (mapped to new CSS patterns for backward compatibility)
  | "cubes"
  | "mathematics"
  | "dots"
  | "diagonal"
  | "smudge"
  | "paper"
  | "denim"
  | "squares"
  | "mosaic"
  | "cotton";

export interface PatternConfig {
  className: string;
}

/**
 * Legacy pattern name mapping to new CSS pattern classes
 */
const LEGACY_PATTERN_MAP: Record<string, PatternType> = {
  cubes: "grid-nested",
  mathematics: "grid-graph",
  dots: "dot-subtle",
  diagonal: "line-diagonal",
  smudge: "ring-noise",
  paper: "tex-paper",
  denim: "tex-woven",
  squares: "grid-soft",
  mosaic: "grid-nested",
  cotton: "tex-woven",
};

/**
 * Pattern configurations with CSS class names
 */
export const PATTERN_CONFIGS: Record<PatternType, PatternConfig> = {
  default: {
    className: "",
  },
  // Dot patterns
  "dot-subtle": { className: "dot-subtle" },
  "dot-halftone": { className: "dot-halftone" },
  "dot-polka": { className: "dot-polka" },
  "dot-stars": { className: "dot-stars" },
  "dot-node": { className: "dot-node" },
  "dot-striped": { className: "dot-striped" },
  // Line patterns
  "line-vertical": { className: "line-vertical" },
  "line-horizontal": { className: "line-horizontal" },
  "line-stacked": { className: "line-stacked" },
  "line-hashrate": { className: "line-hashrate" },
  "line-diagonal": { className: "line-diagonal" },
  // Grid patterns
  "grid-soft": { className: "grid-soft" },
  "grid-offset": { className: "grid-offset" },
  "grid-graph": { className: "grid-graph" },
  "grid-nested": { className: "grid-nested" },
  "grid-datacenter": { className: "grid-datacenter" },
  "grid-plus": { className: "grid-plus" },
  "grid-minimal-plus": { className: "grid-minimal-plus" },
  // Ring patterns
  "ring-concentric": { className: "ring-concentric" },
  "ring-outline": { className: "ring-outline" },
  "ring-quarter": { className: "ring-quarter" },
  "ring-orbital": { className: "ring-orbital" },
  "ring-radar": { className: "ring-radar" },
  "ring-noise": { className: "ring-noise" },
  // Wave patterns
  "wave-scallop": { className: "wave-scallop" },
  "wave-stripe": { className: "wave-stripe" },
  // Texture patterns
  "tex-woven": { className: "tex-woven" },
  "tex-herringbone": { className: "tex-herringbone" },
  "tex-brick": { className: "tex-brick" },
  "tex-paper": { className: "tex-paper" },
  // Shape patterns
  "shape-checker": { className: "shape-checker" },
  "shape-triangle": { className: "shape-triangle" },
  "shape-zigzag": { className: "shape-zigzag" },
  "shape-bracket": { className: "shape-bracket" },
  // Legacy patterns (mapped to new CSS patterns)
  cubes: { className: "grid-nested" },
  mathematics: { className: "grid-graph" },
  dots: { className: "dot-subtle" },
  diagonal: { className: "line-diagonal" },
  smudge: { className: "ring-noise" },
  paper: { className: "tex-paper" },
  denim: { className: "tex-woven" },
  squares: { className: "grid-soft" },
  mosaic: { className: "grid-nested" },
  cotton: { className: "tex-woven" },
};

/**
 * Get pattern configuration by type
 * Handles legacy pattern names by mapping them to new CSS patterns
 */
export function getPatternConfig(type: PatternType = "default"): PatternConfig {
  // Map legacy pattern names to new CSS patterns
  const mappedType = LEGACY_PATTERN_MAP[type] || type;
  return PATTERN_CONFIGS[mappedType] || PATTERN_CONFIGS.default;
}

/**
 * Get pattern CSS class name
 * 
 * Use this function to get the CSS class name for a pattern type.
 * The returned class name can be applied to any HTML element to add a background pattern.
 * 
 * @param type - The pattern type to get the class name for
 * @returns The CSS class name for the pattern, or empty string for "default"
 * 
 * @example
 * // In a React component
 * import { getPatternClassName } from 'beacon-ui/utils/patternPaths';
 * 
 * function MyComponent() {
 *   const patternClass = getPatternClassName('dot-node');
 *   return <div className={patternClass}>Content</div>;
 * }
 * 
 * @example
 * // In a template string
 * const patternClass = getPatternClassName('grid-nested');
 * const className = 'container ' + patternClass;
 * 
 * @example
 * // Conditional pattern application
 * const patternClass = showPattern ? getPatternClassName('tex-woven') : '';
 * const cardClassName = 'card ' + patternClass;
 * <div className={cardClassName}>Card content</div>
 */
export function getPatternClassName(type: PatternType): string {
  const config = getPatternConfig(type);
  return config.className || "";
}

