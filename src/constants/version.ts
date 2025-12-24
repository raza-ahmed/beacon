/**
 * Design System Version
 * 
 * Centralized version number for the Beacon Design System.
 * Update this value when releasing a new version.
 * 
 * Format: Major.Minor (e.g., "2.8")
 */
export const DESIGN_SYSTEM_VERSION = "3.01";

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

