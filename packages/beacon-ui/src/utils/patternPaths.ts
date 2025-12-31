/**
 * Background pattern configurations
 * Patterns are 128px x 128px frames with tiled images inside
 * Images automatically tile to fill the space while maintaining pattern
 */

export type PatternType =
  | "default"
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
  imageUrl: string;
  backgroundSize: string;
  backgroundPosition?: string;
  inset?: string;
}

/**
 * Pattern configurations with image URLs and tiling settings
 * Images are stored in the package assets and copied to public/images/patterns/ during build
 * They are referenced via /images/patterns/ paths in the consuming application
 */
export const PATTERN_CONFIGS: Record<PatternType, PatternConfig> = {
  default: {
    imageUrl: "", // No pattern for default
    backgroundSize: "128px 128px",
  },
  cubes: {
    imageUrl: "/images/patterns/Cube_pt.png",
    backgroundSize: "33.5px 50px",
    backgroundPosition: "top left",
  },
  mathematics: {
    imageUrl: "/images/patterns/Maths_pt.png",
    backgroundSize: "64px 128px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  dots: {
    imageUrl: "/images/patterns/Dots_pt.png",
    backgroundSize: "186px 186px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  diagonal: {
    imageUrl: "/images/patterns/Diagonal_pt.png",
    backgroundSize: "7px 7px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  smudge: {
    imageUrl: "/images/patterns/Smudge_pt.png",
    backgroundSize: "200px 200px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  paper: {
    imageUrl: "/images/patterns/Rough_Paper_pt.png",
    backgroundSize: "158px 158px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  denim: {
    imageUrl: "/images/patterns/Denim_pt.png",
    backgroundSize: "210px 163px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  squares: {
    imageUrl: "/images/patterns/Squares_pt.png",
    backgroundSize: "32px 32px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  mosaic: {
    imageUrl: "/images/patterns/Mosaic_pt.png",
    backgroundSize: "355px 288px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  cotton: {
    imageUrl: "/images/patterns/Cotton_pt.png",
    backgroundSize: "157.5px 157.5px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
};

/**
 * Get pattern configuration by type
 */
export function getPatternConfig(type: PatternType = "default"): PatternConfig {
  return PATTERN_CONFIGS[type] || PATTERN_CONFIGS.default;
}

/**
 * Get pattern image URL
 * For production, replace with local paths: `/images/patterns/${type}.png`
 */
export function getPatternImageUrl(type: PatternType): string {
  const config = getPatternConfig(type);
  if (type === "default" || !config.imageUrl) {
    return "";
  }
  return config.imageUrl;
}

