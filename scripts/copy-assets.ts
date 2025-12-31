/**
 * Copy assets from beacon-ui package to public directory for Next.js
 * 
 * NOTE: This creates duplication, but it's necessary for Next.js static export.
 * Images exist in two places:
 * 1. packages/beacon-ui/assets/ - Source of truth (included in npm package)
 * 2. public/images/ - Copied here for Next.js to serve (required for static export)
 * 
 * For the docs site (monorepo), we copy during build/dev.
 * For external consumers, they should copy from node_modules/beacon-ui/assets/ to their public/ directory.
 * 
 * Alternative approaches considered:
 * - Symlinks: Cross-platform issues, git complications
 * - Direct imports: Doesn't work with /images/* public paths
 * - Rewrites: Not supported with static export
 */

import * as fs from "fs";
import * as path from "path";

const packageAssetsDir = path.join(__dirname, "../packages/beacon-ui/assets");
const publicImagesDir = path.join(__dirname, "../public/images");

// Directories to copy
const assetDirs = ["patterns", "avatars", "preview"];

function copyDirectory(src: string, dest: string) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory does not exist: ${src}`);
    return;
  }

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Copy all files
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("Copying assets from package to public...");

for (const dir of assetDirs) {
  const src = path.join(packageAssetsDir, dir);
  const dest = path.join(publicImagesDir, dir);
  
  if (fs.existsSync(src)) {
    copyDirectory(src, dest);
    console.log(`✓ Copied ${dir}/`);
  } else {
    console.warn(`⚠ Source directory not found: ${src}`);
  }
}

console.log("Asset copy complete!");

