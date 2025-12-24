"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Theme, HueVariant } from "@/tokens/types";

interface ThemeContextValue {
  theme: Theme;
  hue: HueVariant;
  setTheme: (theme: Theme) => void;
  setHue: (hue: HueVariant) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "design-system-theme";
const HUE_STORAGE_KEY = "design-system-hue";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  defaultHue?: HueVariant;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  defaultHue = "hue-indigo",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [hue, setHueState] = useState<HueVariant>(defaultHue);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage or use default
  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const storedHue = localStorage.getItem(HUE_STORAGE_KEY) as HueVariant | null;

    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      // Use default theme (dark) for first-time users
      setThemeState(defaultTheme);
    }

    if (storedHue) {
      setHueState(storedHue);
    } else {
      // Use default hue (hue-indigo) for first-time users
      setHueState(defaultHue);
    }
  }, [defaultTheme, defaultHue]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-hue", hue);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#151414" : "#f7fafc"
      );
    }
  }, [theme, hue, mounted]);

  // Note: System preference detection removed to use dark theme as default
  // Users can still manually change theme, which will be saved to localStorage

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  const setHue = useCallback((newHue: HueVariant) => {
    setHueState(newHue);
    localStorage.setItem(HUE_STORAGE_KEY, newHue);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        hue,
        setTheme,
        setHue,
        toggleTheme,
      }}
    >
      {/* Prevent flash by hiding until mounted */}
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Safe hook that returns undefined if not within provider.
 * Useful for optional theme access.
 */
export function useThemeSafe(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
