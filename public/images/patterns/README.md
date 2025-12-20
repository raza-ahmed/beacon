# Background Patterns

This directory contains background pattern images used in the Generic Card component.

## Pattern Types

The following pattern types are available:

- **cubes** - Cubes pattern (33.5px × 50px)
- **mathematics** - Mathematics pattern (64px × 128px)
- **dots** - Dots pattern (186px × 186px)
- **diagonal** - Diagonal lines pattern (7px × 7px)
- **smudge** - Charcoal smudge pattern (200px × 200px)
- **paper** - Rough paper pattern (158px × 158px)
- **denim** - Denim pattern (210px × 163px)
- **squares** - Squares pattern (32px × 32px)
- **mosaic** - Mosaic pattern (355px × 288px)
- **cotton** - Cotton pattern (157.5px × 157.5px)

## How Patterns Work

Each pattern is a 128px × 128px frame containing a tiled image. The images use CSS `background-repeat: repeat` to automatically tile and fill any space while maintaining the pattern structure.

## Adding Pattern Images

Currently, patterns use Figma asset URLs which expire after 7 days. For production use:

1. Download the pattern images from Figma
2. Save them in this directory with the naming convention: `{pattern-type}.png`
   - Example: `cubes.png`, `mathematics.png`, etc.
3. Update `src/utils/patternPaths.ts` to use local paths:

```typescript
export const PATTERN_CONFIGS: Record<PatternType, PatternConfig> = {
  cubes: {
    imageUrl: "/images/patterns/cubes.png", // Changed from Figma URL
    backgroundSize: "33.5px 50px",
    backgroundPosition: "top left",
  },
  // ... update other patterns similarly
};
```

## Pattern Configuration

Each pattern has a configuration object that specifies:
- `imageUrl`: Path to the pattern image
- `backgroundSize`: The size of each tile (e.g., "33.5px 50px")
- `backgroundPosition`: Starting position (usually "top left")
- `inset`: Optional offset for positioning (e.g., "0 -322px -322px 0")

These settings ensure the pattern tiles correctly and maintains its visual structure when applied to cards of different sizes.

