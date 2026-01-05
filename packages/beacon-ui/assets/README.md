# Assets

This directory contains static assets (images) used by the Beacon UI components.

## Structure

- **avatars/** - Avatar placeholder images
- **preview/** - Preview/demo images for documentation examples

## Usage

These assets are part of the `beacon-ui` package. For Next.js applications:

1. The assets are automatically copied to `public/images/` during build via the `copy:assets` script
2. Components reference them via `/images/avatars/`, `/images/preview/` paths
3. For non-Next.js applications, copy these assets to your public/assets directory manually

## Package Distribution

When the package is published, these assets are included in the npm package under `node_modules/beacon-ui/assets/`.

Consuming applications should copy these assets to their public directory. You can use the provided postinstall script or copy them manually.

