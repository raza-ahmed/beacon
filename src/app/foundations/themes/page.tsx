"use client";

import { useEffect, useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { Theme, HueVariant } from "@/tokens/types";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const HUE_OPTIONS: { value: HueVariant; label: string }[] = [
  { value: "chromatic-prime", label: "Chromatic Prime" },
  { value: "hue-sky", label: "Hue Sky" },
  { value: "hue-indigo", label: "Hue Indigo" },
];

function useComputedTokenValues(theme: Theme, hue: HueVariant, cssVars: `--${string}`[]): Record<string, string> {
  const [computed, setComputed] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Create a temporary element with the theme/hue attributes to compute values
    const tempEl = document.createElement("div");
    tempEl.setAttribute("data-theme", theme);
    tempEl.setAttribute("data-hue", hue);
    tempEl.style.position = "absolute";
    tempEl.style.visibility = "hidden";
    tempEl.style.pointerEvents = "none";
    tempEl.style.top = "-9999px";
    document.body.appendChild(tempEl);

    // Force a reflow to ensure styles are computed
    void tempEl.offsetHeight;

    const styles = getComputedStyle(tempEl);
    const values: Record<string, string> = {};

    cssVars.forEach((cssVar) => {
      values[cssVar] = styles.getPropertyValue(cssVar).trim();
    });

    document.body.removeChild(tempEl);
    setComputed(values);
  }, [theme, hue, mounted]);

  return computed;
}

function ThemePreview({
  theme,
  hue,
  onApply,
}: {
  theme: Theme;
  hue: HueVariant;
  onApply: () => void;
}) {
  const keyBrandTokens: `--${string}`[] = useMemo(
    () => [
      "--bg-page-primary",
      "--bg-primary",
      "--fg-neutral",
      "--fg-primary",
      "--border-primary",
    ],
    []
  );

  const computed = useComputedTokenValues(theme, hue, keyBrandTokens);

  return (
    <div className="ds-theme-preview__card" data-theme={theme} data-hue={hue}>
      <div className="ds-theme-preview__header">
        <h6 className="ds-theme-preview__title">
          {THEME_OPTIONS.find((o) => o.value === theme)?.label} + {HUE_OPTIONS.find((o) => o.value === hue)?.label}
        </h6>
        <button
          className="ds-theme-preview__apply"
          onClick={onApply}
          aria-label={`Apply ${theme} theme with ${hue} hue`}
        >
          Apply
        </button>
      </div>
      <div className="ds-theme-preview__content">
        <div className="ds-theme-preview__surface" style={{ backgroundColor: `var(--bg-page-primary)`, color: `var(--fg-neutral)` }}>
          <div className="ds-theme-preview__brand" style={{ backgroundColor: `var(--bg-primary)`, color: `var(--fg-on-action)` }}>
            Brand
          </div>
          <div className="ds-theme-preview__text">
            <p style={{ color: `var(--fg-neutral)` }}>Primary text</p>
            <p style={{ color: `var(--fg-neutral-secondary)` }}>Secondary text</p>
          </div>
        </div>
        <div className="ds-theme-preview__tokens">
          <div className="ds-theme-preview__token">
            <code className="ds-theme-preview__token-name">--bg-page-primary</code>
            <span className="ds-theme-preview__token-value">{computed["--bg-page-primary"] || "—"}</span>
          </div>
          <div className="ds-theme-preview__token">
            <code className="ds-theme-preview__token-name">--bg-primary</code>
            <span className="ds-theme-preview__token-value">{computed["--bg-primary"] || "—"}</span>
          </div>
          <div className="ds-theme-preview__token">
            <code className="ds-theme-preview__token-name">--fg-neutral</code>
            <span className="ds-theme-preview__token-value">{computed["--fg-neutral"] || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "true");
  el.style.position = "absolute";
  el.style.left = "0";
  el.style.top = "0";
  el.style.transform = "translateX(-100%)";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export default function ThemesPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyCode = async (code: string, blockId: string) => {
    await copyToClipboard(code);
    setCopiedBlock(blockId);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  // Clean theme object to remove conflicting background properties
  // Always use dark theme (vscDarkPlus) since background is always dark (Primary Black)
  const syntaxTheme = useMemo(() => {
    const baseTheme = vscDarkPlus;
    const cleanedTheme: typeof baseTheme = { ...baseTheme };
    
    // Remove background properties from all selectors to avoid conflicts
    Object.keys(cleanedTheme).forEach((key) => {
      if (cleanedTheme[key] && typeof cleanedTheme[key] === "object") {
        const selector = cleanedTheme[key] as Record<string, string>;
        if (selector.background) {
          delete selector.background;
        }
        if (selector.backgroundColor) {
          delete selector.backgroundColor;
        }
      }
    });
    
    return cleanedTheme;
  }, []);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "combinations", label: "Theme Combinations" },
      { id: "how-it-works", label: "How It Works" },
      { id: "usage-guidance", label: "Usage Guidance" },
    ];
  }, []);

  const handleApplyTheme = (newTheme: Theme, newHue: HueVariant) => {
    setTheme(newTheme);
    setHue(newHue);
  };

  const allCombinations = useMemo(() => {
    const combos: Array<{ theme: Theme; hue: HueVariant }> = [];
    THEME_OPTIONS.forEach((t) => {
      HUE_OPTIONS.forEach((h) => {
        combos.push({ theme: t.value, hue: h.value });
      });
    });
    return combos;
  }, []);

  if (!mounted) {
    return (
      <PageLayout tocItems={tocItems} currentPath="/foundations/themes">
        <article className="ds-content">
          <header className="ds-content__header">
            <h3 className="ds-content__title">Themes</h3>
            <p className="ds-content__subtitle">Loading theme information...</p>
          </header>
        </article>
      </PageLayout>
    );
  }

  return (
    <PageLayout tocItems={tocItems} currentPath="/foundations/themes">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Themes</h3>
          <p className="ds-content__subtitle">
            The design system supports two themes (Light and Dark) and three hue variants (Chromatic Prime, Hue Sky, and Hue Indigo), providing 6 unique combinations.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Beacon uses a two-layer theme system that provides flexibility and consistency across different contexts:
          </p>
          <div className="ds-token-mapping">
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Theme</h6>
              </div>
              <code className="ds-token-mapping__example">data-theme="light"</code>
              <p className="ds-token-mapping__desc">
                Controls the overall brightness and contrast of the interface. The Light theme uses lighter backgrounds and darker text, while the Dark theme uses darker backgrounds and lighter text. Brand tokens automatically adapt based on the selected theme.
              </p>
            </div>
            <div className="ds-token-mapping__arrow">+</div>
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Hue</h6>
              </div>
              <code className="ds-token-mapping__example">data-hue="chromatic-prime"</code>
              <p className="ds-token-mapping__desc">
                Controls the primary color palette used throughout the interface. The hue variant determines which semantic color tokens are used for brand colors, allowing you to customize the primary accent color while maintaining theme consistency.
              </p>
            </div>
          </div>
          <div className="ds-token-mapping__example-box" style={{ marginTop: "var(--spacing-400)" }}>
            <p className="ds-content__text">
              <strong>How themes are applied:</strong>
            </p>
            <ul className="ds-content__bullet-list">
              <li>
                Themes are applied via <code>data-theme</code> and <code>data-hue</code> attributes on the root element
              </li>
              <li>
                User preferences are stored in localStorage and persist across sessions
              </li>
              <li>
                The system automatically detects and respects the user's system color scheme preference (if no manual preference is set)
              </li>
              <li>
                Brand tokens automatically resolve to different values based on the active theme and hue combination
              </li>
            </ul>
          </div>
        </section>

        <section id="combinations" className="ds-content__section">
          <h6 className="ds-content__section-title">Theme Combinations</h6>
          <p className="ds-content__text">
            Preview all 6 theme and hue combinations. Click "Apply" on any preview to switch the entire documentation site to that combination.
          </p>
          <div className="ds-theme-preview">
            {allCombinations.map((combo) => (
              <ThemePreview
                key={`${combo.theme}-${combo.hue}`}
                theme={combo.theme}
                hue={combo.hue}
                onApply={() => handleApplyTheme(combo.theme, combo.hue)}
              />
            ))}
          </div>
        </section>

        <section id="how-it-works" className="ds-content__section">
          <h6 className="ds-content__section-title">How It Works</h6>
          <p className="ds-content__text">
            Themes are implemented using CSS attribute selectors and React context. Here's how it works:
          </p>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">CSS Implementation</h6>
            <p className="ds-content__text">
              Brand tokens are defined with theme-specific selectors:
            </p>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ds-code-copy"
                onClick={() => handleCopyCode(`:root, [data-theme="light"] {
                --bg-page-primary: var(--color-neutral-50);
                --fg-neutral: var(--color-neutral-900);
              }

              [data-theme="dark"] {
                --bg-page-primary: var(--color-neutral-800);
                --fg-neutral: var(--color-neutral-50);
              }`, "css-1")}
                aria-label="Copy code"
              >
                {copiedBlock === "css-1" ? (
                  <>
                    <CheckIcon size="xs" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size="xs" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <SyntaxHighlighter
                language="css"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`:root, [data-theme="light"] {
  --bg-page-primary: var(--color-neutral-50);
  --fg-neutral: var(--color-neutral-900);
}

[data-theme="dark"] {
  --bg-page-primary: var(--color-neutral-800);
  --fg-neutral: var(--color-neutral-50);
}`}
              </SyntaxHighlighter>
            </div>
            <p className="ds-content__text">
              The <code>data-hue</code> attribute controls which semantic color tokens are used:
            </p>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ds-code-copy"
                onClick={() => handleCopyCode(`[data-hue="chromatic-prime"] {
                    --color-primary-500: var(--color-purple-500);
                  }

                  [data-hue="hue-sky"] {
                    --color-primary-500: var(--color-sky-500);
                  }

                  [data-hue="hue-indigo"] {
                    --color-primary-500: var(--color-indigo-500);
                  }`, "css-2")}
                  aria-label="Copy code"
                >
                {copiedBlock === "css-2" ? (
                  <>
                    <CheckIcon size="xs" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size="xs" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <SyntaxHighlighter
                language="css"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`[data-hue="chromatic-prime"] {
                  --color-primary-500: var(--color-purple-500);
                }

                [data-hue="hue-sky"] {
                  --color-primary-500: var(--color-sky-500);
                }

                [data-hue="hue-indigo"] {
                  --color-primary-500: var(--color-indigo-500);
                }`}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">React Implementation</h6>
            <p className="ds-content__text">
              Use the <code>ThemeProvider</code> and <code>useTheme</code> hook in your components:
            </p>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ds-code-copy"
                onClick={() => handleCopyCode(`import { ThemeProvider } from "@/providers/ThemeProvider";
                import { useTheme } from "@/providers/ThemeProvider";

                function App() {
                  return (
                    <ThemeProvider>
                      <YourApp />
                    </ThemeProvider>
                  );
                }

                function YourComponent() {
                  const { theme, hue, setTheme, setHue, toggleTheme } = useTheme();
                  
                  return (
                    <button onClick={() => setTheme("dark")}>
                      Switch to Dark
                    </button>
                  );
                }`, "tsx-1")}
                aria-label="Copy code"
              >
                {copiedBlock === "tsx-1" ? (
                  <>
                    <CheckIcon size="xs" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size="xs" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <SyntaxHighlighter
                language="tsx"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`import { ThemeProvider } from "@/providers/ThemeProvider";
                import { useTheme } from "@/providers/ThemeProvider";

                function App() {
                  return (
                    <ThemeProvider>
                      <YourApp />
                    </ThemeProvider>
                  );
                }

                function YourComponent() {
                  const { theme, hue, setTheme, setHue, toggleTheme } = useTheme();
                  
                  return (
                    <button onClick={() => setTheme("dark")}>
                      Switch to Dark
                    </button>
                  );
                }`}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Storage and Persistence</h6>
            <p className="ds-content__text">
              Theme preferences are automatically saved to localStorage and restored on page load. If no preference is set, the system detects the user's OS color scheme preference.
            </p>
          </div>
        </section>

        <section id="usage-guidance" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Guidance</h6>
          <p className="ds-content__text">
            Best practices for working with themes in your components:
          </p>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Always Use Theme Tokens</h6>
            <p className="ds-content__text">
              Never use hard-coded color values. Always reference theme tokens via CSS variables:
            </p>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ds-code-copy"
                onClick={() => handleCopyCode(`/* Good */
background-color: var(--bg-page-primary);
color: var(--fg-neutral);

/* Bad */
background-color: #ffffff;
color: #000000;`, "css-3")}
                aria-label="Copy code"
              >
                {copiedBlock === "css-3" ? (
                  <>
                    <CheckIcon size="xs" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon size="xs" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <SyntaxHighlighter
                language="css"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: "var(--spacing-300)",
                  backgroundColor: "var(--static-primary-black)",
                  fontSize: "var(--body-small-text-size)",
                  borderRadius: "var(--corner-radius-200)",
                  border: "none",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  },
                }}
                PreTag="div"
              >
                {`/* Good */
background-color: var(--bg-page-primary);
color: var(--fg-neutral);

/* Bad */
background-color: #ffffff;
color: #000000;`}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Choosing a Hue Variant</h6>
            <ul className="ds-content__bullet-list">
              <li>
                <strong>Chromatic Prime:</strong> Default purple-based palette. Use for most applications.
              </li>
              <li>
                <strong>Hue Sky:</strong> Blue-based palette. Use for applications that need a cooler, more professional feel.
              </li>
              <li>
                <strong>Hue Indigo:</strong> Indigo-based palette. Use for applications that need a vibrant, energetic feel.
              </li>
            </ul>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Testing Both Themes</h6>
            <p className="ds-content__text">
              Always test your components in both light and dark themes to ensure:
            </p>
            <ul className="ds-content__bullet-list">
              <li>Text remains readable with sufficient contrast</li>
              <li>Interactive elements are clearly visible</li>
              <li>Visual hierarchy is maintained</li>
              <li>Brand colors work well in both contexts</li>
            </ul>
          </div>

          <div className="ds-content__subsection">
            <h6 className="ds-content__subsection-title">Component Isolation</h6>
            <p className="ds-content__text">
              When creating components that need to work in different theme contexts, use CSS custom properties and avoid hard-coded theme assumptions. The theme system will automatically handle token resolution.
            </p>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

