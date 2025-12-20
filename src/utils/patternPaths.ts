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
 * Note: These URLs are from Figma and expire after 7 days.
 * For production, download these images and store them in public/images/patterns/
 */
export const PATTERN_CONFIGS: Record<PatternType, PatternConfig> = {
  default: {
    imageUrl: "", // No pattern for default
    backgroundSize: "128px 128px",
  },
  cubes: {
    imageUrl: "https://www.figma.com/api/mcp/asset/3594165a-11de-4be4-818c-90c23daf0172",
    backgroundSize: "33.5px 50px",
    backgroundPosition: "top left",
  },
  mathematics: {
    imageUrl: "https://www.figma.com/api/mcp/asset/db1da532-dc86-42e2-8edb-cebd1f4583d9",
    backgroundSize: "64px 128px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  dots: {
    imageUrl: "https://www.figma.com/api/mcp/asset/c320aab8-9413-4f04-b5d9-5dab473bf72c",
    backgroundSize: "186px 186px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  diagonal: {
    imageUrl: "https://www.figma.com/api/mcp/asset/63f95452-d091-48c8-9315-17b2db88811f",
    backgroundSize: "7px 7px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  smudge: {
    imageUrl: "https://www.figma.com/api/mcp/asset/953c58bc-519e-453a-801e-aa7771123bf0",
    backgroundSize: "200px 200px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  paper: {
    imageUrl: "https://www.figma.com/api/mcp/asset/6cac21b4-e9cb-4b07-9655-9da328879b35",
    backgroundSize: "158px 158px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  denim: {
    imageUrl: "https://www.figma.com/api/mcp/asset/df4b639a-4aa8-47b3-a356-1704c5d0e8ca",
    backgroundSize: "210px 163px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  squares: {
    imageUrl: "https://www.figma.com/api/mcp/asset/7d44ab02-5237-4466-9957-80d02eac70a8",
    backgroundSize: "32px 32px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  mosaic: {
    imageUrl: "https://www.figma.com/api/mcp/asset/d78c45bb-6e59-4444-a78b-740387c8d790",
    backgroundSize: "355px 288px",
    backgroundPosition: "top left",
    inset: "0 -322px -322px 0",
  },
  cotton: {
    imageUrl: "https://www.figma.com/api/mcp/asset/9010e582-f104-4247-9a42-450d3c28fa71",
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

