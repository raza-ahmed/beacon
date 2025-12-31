/**
 * Version Sync Script
 * 
 * Syncs the version from packages/beacon-ui/package.json (source of truth)
 * to all other locations that need the version:
 * - src/constants/version.ts
 * - README.md (if it has a hardcoded version)
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const BEACON_UI_PACKAGE_JSON = path.join(PROJECT_ROOT, "packages", "beacon-ui", "package.json");
const VERSION_TS = path.join(PROJECT_ROOT, "src", "constants", "version.ts");
const README_MD = path.join(PROJECT_ROOT, "README.md");

// Read version from beacon-ui package.json
function getVersion(): string {
  const packageJson = JSON.parse(fs.readFileSync(BEACON_UI_PACKAGE_JSON, "utf-8"));
  const version = packageJson.version;
  if (!version) {
    throw new Error("Version not found in packages/beacon-ui/package.json");
  }
  return version;
}

// Update src/constants/version.ts
function updateVersionTs(version: string): void {
  const content = fs.readFileSync(VERSION_TS, "utf-8");
  const updated = content.replace(
    /export const DESIGN_SYSTEM_VERSION = "[\d.]+";/,
    `export const DESIGN_SYSTEM_VERSION = "${version}";`
  );
  fs.writeFileSync(VERSION_TS, updated, "utf-8");
  console.log(`✓ Updated ${VERSION_TS}`);
}

// Update README.md if it has a hardcoded version
function updateReadme(version: string): void {
  const content = fs.readFileSync(README_MD, "utf-8");
  // Update version references in README (e.g., "Version: 3.1.4" or "Current version: **3.1.4**")
  // Match patterns like "- **Version**: `3.1.4`" or "Current version: **3.1.4**"
  const updated = content
    .replace(/- \*\*Version\*\*: `[\d.]+`/g, `- **Version**: \`${version}\``)
    .replace(/Current version: \*\*[\d.]+\*\*/g, `Current version: **${version}**`)
    .replace(/Version\*\*: `[\d.]+`/g, `Version**: \`${version}\``)
    .replace(/- \*\*Version\*\*: [\d.]+/g, `- **Version**: ${version}`);
  
  if (updated !== content) {
    fs.writeFileSync(README_MD, updated, "utf-8");
    console.log(`✓ Updated ${README_MD}`);
  } else {
    console.log(`- No version references found in ${README_MD}`);
  }
}

// Generate version data from CHANGELOG.md
function generateVersionData(): void {
  try {
    const scriptPath = path.join(__dirname, "generate-version-data.ts");
    execSync(`npx tsx "${scriptPath}"`, { stdio: "inherit", cwd: PROJECT_ROOT });
  } catch (error) {
    console.error("Error generating version data:", error);
    // Don't exit - version sync can still succeed even if data generation fails
  }
}

// Main execution
try {
  const version = getVersion();
  console.log(`Syncing version ${version}...\n`);
  
  updateVersionTs(version);
  updateReadme(version);
  generateVersionData();
  
  console.log(`\n✓ Version sync complete!`);
} catch (error) {
  console.error("Error syncing version:", error);
  process.exit(1);
}

