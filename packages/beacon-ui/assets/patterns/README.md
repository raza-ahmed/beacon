# Pattern Images

This directory contains background pattern images used by the Card component.

## Usage

These images are part of the `beacon-ui` package and are stored in `packages/beacon-ui/assets/patterns/`. 

For the documentation site, they are automatically copied to `public/images/patterns/` during build via the `copy:assets` script.

For consuming applications:

1. Copy the pattern images from `node_modules/beacon-ui/assets/patterns/` to your application's `public/images/patterns/` directory
2. The Card component will automatically reference them via `/images/patterns/` paths

## Pattern Files

- `Cube_pt.png` - Cubes pattern
- `Maths_pt.png` - Mathematics pattern
- `Dots_pt.png` - Dots pattern
- `Diagonal_pt.png` - Diagonal lines pattern
- `Smudge_pt.png` - Charcoal smudge pattern
- `Rough_Paper_pt.png` - Rough paper pattern
- `Denim_pt.png` - Denim pattern
- `Squares_pt.png` - Squares pattern
- `Mosaic_pt.png` - Mosaic pattern
- `Cotton_pt.png` - Cotton pattern

## Automatic Setup (Optional)

You can add a postinstall script to your `package.json` to automatically copy these images:

```json
{
  "scripts": {
    "postinstall": "mkdir -p public/images/patterns && cp -r node_modules/beacon-ui/assets/patterns/* public/images/patterns/"
  }
}
```

