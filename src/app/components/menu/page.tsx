"use client";

import { useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant } from "@/tokens/types";
import { MenuPreview } from "@/components/MenuPreview";
import { MenuControls } from "@/components/MenuControls";
import { CopyIcon, CheckIcon } from "@/components/icons";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { createThemeAwareSyntaxTheme } from "@/utils/syntaxTheme";

type MenuVariant = "desktop" | "tablet-open" | "tablet-closed" | "mobile-open" | "mobile-closed" | "close-menu";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: (item: MenuItem) => void;
}

interface MenuConfig {
  variant: MenuVariant;
  showMenu: boolean;
  showButton: boolean;
  menuItems: MenuItem[];
  headerTitle: string;
  headerSubtitle: string;
  showChevrons: boolean;
  avatarImageUrl: string;
  selectedItemId?: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: "1", label: "Menu Item #1" },
  { id: "2", label: "Menu Item #2" },
  { id: "3", label: "Menu Item #3" },
  { id: "4", label: "Menu Item #4" },
  { id: "5", label: "Menu Item #5" },
];

const VARIANT_LABELS: Record<MenuVariant, string> = {
  desktop: "desktop",
  "tablet-open": "tablet-open",
  "tablet-closed": "tablet-closed",
  "mobile-open": "mobile-open",
  "mobile-closed": "mobile-closed",
  "close-menu": "close-menu",
};

function generateMenuCode(config: MenuConfig): string {
  const props: string[] = [];

  if (config.variant !== "desktop") {
    props.push(`variant="${VARIANT_LABELS[config.variant]}"`);
  }

  if (!config.showMenu) {
    props.push(`showMenu={false}`);
  }

  if (!config.showButton) {
    props.push(`showButton={false}`);
  }

  if (!config.showChevrons) {
    props.push(`showChevrons={false}`);
  }

  if (config.headerTitle !== "Title") {
    props.push(`headerTitle="${config.headerTitle}"`);
  }

  if (config.headerSubtitle !== "Subtitle") {
    props.push(`headerSubtitle="${config.headerSubtitle}"`);
  }

  if (config.avatarImageUrl) {
    props.push(`avatarImageUrl="${config.avatarImageUrl}"`);
  }

  if (config.selectedItemId) {
    props.push(`selectedItemId="${config.selectedItemId}"`);
  }

  if (config.menuItems.length > 0 && JSON.stringify(config.menuItems) !== JSON.stringify(DEFAULT_MENU_ITEMS)) {
    const itemsStr = config.menuItems
      .map((item) => {
        const itemProps: string[] = [`id: "${item.id}"`, `label: "${item.label}"`];
        if (item.icon) {
          itemProps.push(`icon: <YourIcon size={20} />`);
        }
        if (item.selected) {
          itemProps.push(`selected: true`);
        }
        return `    { ${itemProps.join(", ")} }`;
      })
      .join(",\n");
    props.push(`menuItems={[\n${itemsStr}\n  ]}`);
  }

  if (props.length === 0) {
    return `<Menu />`;
  }

  const propsFormatted = props.map((prop) => `\n  ${prop}`).join("");

  return `<Menu${propsFormatted}
/>`;
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

export default function MenuPage() {
  const { theme, hue, setTheme, setHue } = useTheme();
  const [config, setConfig] = useState<MenuConfig>({
    variant: "desktop",
    showMenu: true,
    showButton: true,
    menuItems: DEFAULT_MENU_ITEMS,
    headerTitle: "Title",
    headerSubtitle: "Subtitle",
    showChevrons: true,
    avatarImageUrl: "",
    selectedItemId: undefined,
  });
  const [copied, setCopied] = useState(false);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const syntaxTheme = useMemo(() => createThemeAwareSyntaxTheme(theme), [theme]);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "playground", label: "Interactive Playground" },
      { id: "anatomy", label: "Anatomy" },
      { id: "variants", label: "Variants & States" },
      { id: "guidelines", label: "Usage Guidelines" },
      { id: "api", label: "API Reference" },
      { id: "examples", label: "Code Examples" },
    ];
  }, []);

  const updateConfig = (updates: Partial<MenuConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleCopyCode = async () => {
    const code = generateMenuCode(config);
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/components/menu">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Menu</h3>
          <p className="ds-content__subtitle">
            Menu is a sidebar navigation component that provides access to different sections of an application. It adapts to different screen sizes with multiple responsive variants.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            The Menu component is a flexible sidebar navigation that displays menu items, user information, and optional actions. It supports multiple responsive variants to adapt to different screen sizes and use cases.
          </p>
          <p className="ds-content__text">
            Menu items support interactive states (hover, selected, onClick), custom icons, and click handlers. Items automatically highlight on hover and can be marked as selected for active navigation states.
          </p>
          <p className="ds-content__text">
            All menu styles are built using design tokens, ensuring consistency across themes and hues. Use the interactive playground below to explore all available combinations.
          </p>
        </section>

        <section id="playground" className="ds-content__section">
          <h6 className="ds-content__section-title">Interactive Playground</h6>
          <p className="ds-content__text">
            Use the controls to customize the menu and see how it looks in real-time. Toggle between variants, themes, and hues to see how menus adapt to different contexts.
          </p>
          <div className="ds-menu-playground">
            <MenuControls
              variant={config.variant}
              showMenu={config.showMenu}
              showButton={config.showButton}
              menuItems={config.menuItems}
              headerTitle={config.headerTitle}
              headerSubtitle={config.headerSubtitle}
              showChevrons={config.showChevrons}
              avatarImageUrl={config.avatarImageUrl}
              theme={theme}
              hue={hue}
              onVariantChange={(variant) => updateConfig({ variant })}
              onShowMenuChange={(showMenu) => updateConfig({ showMenu })}
              onShowButtonChange={(showButton) => updateConfig({ showButton })}
              onMenuItemsChange={(menuItems) => updateConfig({ menuItems })}
              onHeaderTitleChange={(headerTitle) => updateConfig({ headerTitle })}
              onHeaderSubtitleChange={(headerSubtitle) => updateConfig({ headerSubtitle })}
              onShowChevronsChange={(showChevrons) => updateConfig({ showChevrons })}
              onAvatarImageUrlChange={(avatarImageUrl) => updateConfig({ avatarImageUrl })}
              onThemeChange={setTheme}
              onHueChange={setHue}
            />
            <div className="ds-menu-playground-divider" />
            <div className="ds-menu-preview-section">
              <div className="ds-menu-preview">
                <MenuPreview
                  variant={config.variant}
                  showMenu={config.showMenu}
                  showButton={config.showButton}
                  menuItems={config.menuItems}
                  headerTitle={config.headerTitle}
                  headerSubtitle={config.headerSubtitle}
                  showChevrons={config.showChevrons}
                  avatarImageUrl={config.avatarImageUrl}
                  selectedItemId={config.selectedItemId}
                  theme={theme}
                  hue={hue}
                />
              </div>
            </div>
          </div>
          <div className="ds-menu-preview-code">
            <button
              type="button"
              className="ds-menu-code-copy"
              onClick={handleCopyCode}
              aria-label="Copy code"
            >
              {copied ? (
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
                backgroundColor: "var(--bg-page-secondary)",
                fontSize: "var(--body-small-text-size)",
                borderRadius: 0,
                border: "none",
                flex: 1,
                width: "100%",
                height: "100%",
                overflow: "auto",
              }}
              codeTagProps={{
                style: {
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                },
              }}
              PreTag="div"
            >
              {generateMenuCode(config)}
            </SyntaxHighlighter>
          </div>
        </section>

        <section id="anatomy" className="ds-content__section">
          <h6 className="ds-content__section-title">Anatomy</h6>
          <p className="ds-content__text">
            A menu consists of a header section, menu items list, optional button, and footer elements. The layout adapts based on the selected variant.
          </p>
          <div className="ds-menu-anatomy-diagram">
            <div className="ds-menu-anatomy-diagram__menu">
              <div className="ds-menu-anatomy-diagram__header">
                <div className="ds-menu-anatomy-diagram__avatar" style={{ backgroundColor: "var(--bg-primary)" }} />
                <div>
                  <p className="ds-menu-anatomy-diagram__title">Title</p>
                  <p className="ds-menu-anatomy-diagram__subtitle">Subtitle</p>
                </div>
              </div>
              <div className="ds-menu-anatomy-diagram__menu-item">
                <div className="ds-menu-anatomy-diagram__icon" />
                <p>Menu Item #1</p>
                <div className="ds-menu-anatomy-diagram__chevron" />
              </div>
            </div>
            <div className="ds-menu-anatomy-diagram__labels">
              <div className="ds-menu-anatomy-diagram__label-item">
                <span className="ds-menu-anatomy-diagram__label-name">Header</span>
                <code className="ds-menu-anatomy-diagram__label-code">Avatar (48px), Title, Subtitle</code>
              </div>
              <div className="ds-menu-anatomy-diagram__label-item">
                <span className="ds-menu-anatomy-diagram__label-name">Menu Item</span>
                <code className="ds-menu-anatomy-diagram__label-code">Icon (20px), Label, Optional Chevron</code>
              </div>
              <div className="ds-menu-anatomy-diagram__label-item">
                <span className="ds-menu-anatomy-diagram__label-name">Button</span>
                <code className="ds-menu-anatomy-diagram__label-code">Optional action button with icon</code>
              </div>
              <div className="ds-menu-anatomy-diagram__label-item">
                <span className="ds-menu-anatomy-diagram__label-name">Theme Toggle</span>
                <code className="ds-menu-anatomy-diagram__label-code">Switch component for light/dark mode</code>
              </div>
            </div>
          </div>
        </section>

        <section id="variants" className="ds-content__section">
          <h6 className="ds-content__section-title">Variants & States</h6>
          <p className="ds-content__text">
            Menus come in different responsive variants to fit various screen sizes and use cases.
          </p>
          <div className="ds-menu-variants-grid">
            <div className="ds-menu-variant-card">
              <h6 className="ds-menu-variant-card__title">Desktop</h6>
              <p className="ds-menu-variant-card__desc">
                Full sidebar menu (240px width) with header, menu items, button, and theme toggle. Suitable for desktop screens.
              </p>
              <div className="ds-menu-variant-card__preview">
                <MenuPreview variant="desktop" />
              </div>
            </div>
            <div className="ds-menu-variant-card">
              <h6 className="ds-menu-variant-card__title">Tablet Open</h6>
              <p className="ds-menu-variant-card__desc">
                Compact header (430px width) with menu items visible, button, switch, and close icon. For tablet screens when menu is open.
              </p>
              <div className="ds-menu-variant-card__preview">
                <MenuPreview variant="tablet-open" />
              </div>
            </div>
            <div className="ds-menu-variant-card">
              <h6 className="ds-menu-variant-card__title">Tablet Closed</h6>
              <p className="ds-menu-variant-card__desc">
                Compact header (430px width) with just avatar, button, switch, and hamburger icon. Menu items are hidden.
              </p>
              <div className="ds-menu-variant-card__preview">
                <MenuPreview variant="tablet-closed" />
              </div>
            </div>
            <div className="ds-menu-variant-card">
              <h6 className="ds-menu-variant-card__title">Mobile Open</h6>
              <p className="ds-menu-variant-card__desc">
                Compact header (400px width) with menu items visible, button, switch, and close icon. For mobile screens when menu is open.
              </p>
              <div className="ds-menu-variant-card__preview">
                <MenuPreview variant="mobile-open" />
              </div>
            </div>
            <div className="ds-menu-variant-card">
              <h6 className="ds-menu-variant-card__title">Mobile Closed</h6>
              <p className="ds-menu-variant-card__desc">
                Compact header (400px width) with just avatar, button, switch, and hamburger icon. Menu items are hidden.
              </p>
              <div className="ds-menu-variant-card__preview">
                <MenuPreview variant="mobile-closed" />
              </div>
            </div>
            <div className="ds-menu-variant-card">
              <h6 className="ds-menu-variant-card__title">Close Menu</h6>
              <p className="ds-menu-variant-card__desc">
                Minimal variant showing only a close icon button (430px width). Used for closing the menu.
              </p>
              <div className="ds-menu-variant-card__preview">
                <MenuPreview variant="close-menu" />
              </div>
            </div>
          </div>
        </section>

        <section id="guidelines" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage Guidelines</h6>
          <div className="ds-do-dont">
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Do</div>
              <ul className="ds-content__bullet-list">
                <li>Use menus for primary navigation in applications.</li>
                <li>Use desktop variant for large screens (desktop, laptop).</li>
                <li>Use tablet/mobile variants for smaller screens with appropriate open/closed states.</li>
                <li>Provide clear, descriptive labels for menu items.</li>
                <li>Use icons to enhance visual recognition of menu items.</li>
                <li>Include a header section with user information when appropriate.</li>
                <li>Use chevrons to indicate items with sub-menus or navigation.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't use menus for immediate actions (use buttons instead).</li>
                <li>Don't nest menu items too deeply (keep hierarchy shallow).</li>
                <li>Don't use too many menu items (consider grouping or categorization).</li>
                <li>Don't use menu variants inconsistently across screen sizes.</li>
                <li>Don't hide critical navigation behind closed menu states on mobile.</li>
                <li>Don't use menus without clear visual hierarchy.</li>
                <li>Don't forget to provide keyboard navigation support.</li>
              </ul>
            </div>
          </div>
          <h6 className="ds-content__section-title" style={{ marginTop: "var(--spacing-500)" }}>
            Accessibility
          </h6>
          <ul className="ds-content__bullet-list">
            <li>
              Always provide proper ARIA labels and roles for menu components.
            </li>
            <li>Ensure keyboard navigation support (Arrow keys, Enter, Escape).</li>
            <li>Provide focus indicators for all interactive elements.</li>
            <li>Use semantic HTML elements where possible.</li>
            <li>Ensure sufficient color contrast for all text and icons.</li>
            <li>Provide alternative text for icons when they convey meaning.</li>
            <li>Support screen reader announcements for menu state changes.</li>
          </ul>
        </section>

        <section id="api" className="ds-content__section">
          <h6 className="ds-content__section-title">API Reference</h6>
          <p className="ds-content__text">Menu component props and types.</p>
          <div className="ds-api-reference">
            <div className="ds-api-reference__type">
              <h6 className="ds-api-reference__type-title">MenuProps</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`interface MenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    selected?: boolean;
    onClick?: (item: MenuItem) => void;
}

interface MenuProps {
    variant?: "desktop" | "tablet-open" | "tablet-closed" | "mobile-open" | "mobile-closed" | "close-menu";
    showMenu?: boolean;
    showButton?: boolean;
    menuItems?: MenuItem[];
    headerTitle?: string;
    headerSubtitle?: string;
    showChevrons?: boolean;
    avatarImageUrl?: string;
    selectedItemId?: string;
    onItemClick?: (item: MenuItem) => void;
}`);
                    setCopiedExample("api");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "api" ? (
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
                  language="typescript"
                  style={syntaxTheme}
                  customStyle={{
                    margin: 0,
                    padding: "var(--spacing-300)",
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: (item: MenuItem) => void;
}

interface MenuProps {
  variant?: "desktop" | "tablet-open" | "tablet-closed" | "mobile-open" | "mobile-closed" | "close-menu";
  showMenu?: boolean;
  showButton?: boolean;
  menuItems?: MenuItem[];
  headerTitle?: string;
  headerSubtitle?: string;
  showChevrons?: boolean;
  avatarImageUrl?: string;
  selectedItemId?: string;
  onItemClick?: (item: MenuItem) => void;
}`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-api-reference__props">
              <h6 className="ds-api-reference__props-title">Props</h6>
              <div className="ds-api-reference__props-table">
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>variant</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>"desktop" | "tablet-open" | "tablet-closed" | "mobile-open" | "mobile-closed" | "close-menu"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"desktop"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Responsive variant of the menu. Controls layout, width, and visibility of elements.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showMenu</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to show the menu items list. Only applies to variants that support menu items.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showButton</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to show the optional action button in the menu.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>menuItems</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>MenuItem[]</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>[]</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Array of menu items to display. Each item has an id, label, and optional icon, selected state, and onClick handler.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>headerTitle</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"Title"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Title text displayed in the header section.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>headerSubtitle</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>"Subtitle"</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Subtitle text displayed in the header section.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>showChevrons</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>boolean</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>true</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Whether to show chevron arrows on menu items. Useful for indicating sub-menus or navigation.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>avatarImageUrl</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>undefined</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Optional URL for the avatar image. If not provided, a default icon is displayed.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>selectedItemId</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>string</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>undefined</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    ID of the currently selected menu item. The selected item will be highlighted with primary tonal background.
                  </div>
                </div>
                <div className="ds-api-reference__props-row">
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                    <code>onItemClick</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                    <code>(item: MenuItem) =&gt; void</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--default">
                    <code>undefined</code>
                  </div>
                  <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                    Callback function called when a menu item is clicked. Receives the clicked MenuItem as parameter.
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-api-reference__type" style={{ marginTop: "var(--spacing-500)" }}>
              <h6 className="ds-api-reference__type-title">MenuItem</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: (item: MenuItem) => void;
}`);
                    setCopiedExample("menuitem");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "menuitem" ? (
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
                  language="typescript"
                  style={syntaxTheme}
                  customStyle={{
                    margin: 0,
                    padding: "var(--spacing-300)",
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: (item: MenuItem) => void;
}`}
                </SyntaxHighlighter>
              </div>
              <div className="ds-api-reference__props" style={{ marginTop: "var(--spacing-400)" }}>
                <h6 className="ds-api-reference__props-title">MenuItem Properties</h6>
                <div className="ds-api-reference__props-table">
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>id</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>string</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Unique identifier for the menu item. Used for selection and click handling.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>label</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>string</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Display text for the menu item.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>icon</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>React.ReactNode</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Optional custom icon component. If not provided, defaults to UserPersonIcon. Can be any React node (e.g., icon from beacon-icons).
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>selected</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>boolean</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Whether this menu item is selected. Overrides selectedItemId prop if both are provided.
                    </div>
                  </div>
                  <div className="ds-api-reference__props-row">
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--name">
                      <code>onClick</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--type">
                      <code>(item: MenuItem) =&gt; void</code>
                    </div>
                    <div className="ds-api-reference__props-cell ds-api-reference__props-cell--desc">
                      Optional per-item click handler. Called when this specific item is clicked, in addition to the global onItemClick handler.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="ds-content__section">
          <h6 className="ds-content__section-title">Code Examples</h6>
          <p className="ds-content__text">Copyable code snippets for common menu use cases.</p>
          <div className="ds-code-examples">
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Basic Menu</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Menu />`);
                    setCopiedExample("basic");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "basic" ? (
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
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<Menu />`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Menu with Custom Header</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Menu 
  headerTitle="John Doe"
  headerSubtitle="Administrator"
/>`);
                    setCopiedExample("header");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "header" ? (
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
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<Menu 
  headerTitle="John Doe"
  headerSubtitle="Administrator"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Menu without Button</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Menu 
  showButton={false}
/>`);
                    setCopiedExample("no-button");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "no-button" ? (
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
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<Menu 
  showButton={false}
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Menu without Chevrons</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Menu 
  showChevrons={false}
/>`);
                    setCopiedExample("no-chevrons");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "no-chevrons" ? (
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
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<Menu 
  showChevrons={false}
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Tablet Open Variant</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Menu 
  variant="tablet-open"
/>`);
                    setCopiedExample("tablet-open");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "tablet-open" ? (
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
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<Menu 
  variant="tablet-open"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Menu with Custom Items</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Menu 
  menuItems={[
    { id: "1", label: "Dashboard" },
    { id: "2", label: "Settings" },
    { id: "3", label: "Profile" }
  ]}
/>`);
                    setCopiedExample("custom-items");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "custom-items" ? (
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
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<Menu 
  menuItems={[
    { id: "1", label: "Dashboard" },
    { id: "2", label: "Settings" },
    { id: "3", label: "Profile" }
  ]}
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Menu with Icons and Selection</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`import { Menu, MenuItem } from 'beacon-ui';
import { SearchIcon, SettingsGearIcon, UserPersonIcon } from 'beacon-icons';

const menuItems: MenuItem[] = [
  { 
    id: "1", 
    label: "Search", 
    icon: <SearchIcon size={20} />
  },
  { 
    id: "2", 
    label: "Settings", 
    icon: <SettingsGearIcon size={20} />,
    selected: true
  },
  { 
    id: "3", 
    label: "Profile", 
    icon: <UserPersonIcon size={20} />
  }
];

<Menu 
  menuItems={menuItems}
  selectedItemId="2"
  onItemClick={(item) => console.log('Clicked:', item)}
/>`);
                    setCopiedExample("icons-selection");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "icons-selection" ? (
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
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`import { Menu, MenuItem } from 'beacon-ui';
import { SearchIcon, SettingsGearIcon, UserPersonIcon } from 'beacon-icons';

const menuItems: MenuItem[] = [
  { 
    id: "1", 
    label: "Search", 
    icon: <SearchIcon size={20} />
  },
  { 
    id: "2", 
    label: "Settings", 
    icon: <SettingsGearIcon size={20} />,
    selected: true
  },
  { 
    id: "3", 
    label: "Profile", 
    icon: <UserPersonIcon size={20} />
  }
];

<Menu 
  menuItems={menuItems}
  selectedItemId="2"
  onItemClick={(item) => console.log('Clicked:', item)}
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
            <div className="ds-code-example">
              <h6 className="ds-code-example__title">Menu with Custom Avatar Image</h6>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ds-menu-code-copy"
                  onClick={async () => {
                    await copyToClipboard(`<Menu 
  avatarImageUrl="/images/avatars/user.jpg"
  headerTitle="John Doe"
  headerSubtitle="Administrator"
/>`);
                    setCopiedExample("custom-avatar");
                    setTimeout(() => setCopiedExample(null), 2000);
                  }}
                  aria-label="Copy code"
                  style={{ position: "absolute", top: "var(--spacing-200)", right: "var(--spacing-200)", zIndex: 1 }}
                >
                  {copiedExample === "custom-avatar" ? (
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
                    backgroundColor: "var(--bg-page-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    borderRadius: "var(--corner-radius-200)",
                    border: "var(--border-width-25) solid var(--border-strong-100)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                    },
                  }}
                  PreTag="div"
                >
                  {`<Menu 
  avatarImageUrl="/images/avatars/user.jpg"
  headerTitle="John Doe"
  headerSubtitle="Administrator"
/>`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}

