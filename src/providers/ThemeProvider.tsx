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
  defaultTheme = "light",
  defaultHue = "chromatic-prime",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [hue, setHueState] = useState<HueVariant>(defaultHue);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage or system preference
  useEffect(() => {
    setMounted(true);

    // Check localStorage first
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const storedHue = localStorage.getItem(HUE_STORAGE_KEY) as HueVariant | null;

    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      // Fall back to system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setThemeState(prefersDark ? "dark" : "light");
    }

    if (storedHue) {
      setHueState(storedHue);
    }
  }, []);

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

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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
