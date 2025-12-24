import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Theme } from "@/tokens/types";

/**
 * Creates a theme-aware syntax highlighting theme based on the current theme.
 * Uses Prism's built-in themes: prism (default light) for light mode, tomorrow for dark mode.
 * Removes background colors to work with the design system's background.
 */
export function createThemeAwareSyntaxTheme(theme: Theme) {
  // Use Prism's built-in themes
  const baseTheme = theme === "dark" ? tomorrow : prism;
  const cleanedTheme: typeof baseTheme = { ...baseTheme };

  // Remove background properties to work with design system backgrounds
  Object.keys(cleanedTheme).forEach((key) => {
    if (cleanedTheme[key] && typeof cleanedTheme[key] === "object") {
      const selector = cleanedTheme[key] as Record<string, string>;
      
      // Remove background properties
      if (selector.background) {
        delete selector.background;
      }
      if (selector.backgroundColor) {
        delete selector.backgroundColor;
      }
    }
  });

  return cleanedTheme;
}

