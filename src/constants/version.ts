/**
 * Design System Version
 * 
 * Centralized version number for the Beacon Design System.
 * 
 * ⚠️ AUTO-SYNCED: This file is automatically synced from packages/beacon-ui/package.json
 * Do not edit manually. Run `npm run sync:version` to sync, or it runs automatically
 * before builds and publishes.
 * 
 * Format: Major.Minor.Patch (e.g., "3.1.6")
 */
export const DESIGN_SYSTEM_VERSION = "3.4.1";

/**
 * Get formatted version string with optional prefix
 * @param prefix - Optional prefix (e.g., "V", "Version:")
 * @returns Formatted version string
 */
export function getVersionString(prefix?: string): string {
  if (prefix) {
    return `${prefix} ${DESIGN_SYSTEM_VERSION}`;
  }
  return DESIGN_SYSTEM_VERSION;
}

