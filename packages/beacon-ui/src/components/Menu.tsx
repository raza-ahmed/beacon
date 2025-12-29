"use client";

import { useMemo, ComponentPropsWithRef } from "react";
import { UserPersonIcon, ChevronRightIcon, CloseIcon, MenuIcon, DownloadIcon } from "../icons";
import { Switch } from "./Switch";
import { useThemeSafe } from "../providers/ThemeProvider";

type MenuVariant = "desktop" | "tablet-open" | "tablet-closed" | "mobile-open" | "mobile-closed" | "close-menu";

interface MenuItem {
  id: string;
  label: string;
}

export interface MenuProps extends ComponentPropsWithRef<"div"> {
  variant?: MenuVariant;
  showMenu?: boolean;
  showButton?: boolean;
  menuItems?: MenuItem[];
  headerTitle?: string;
  headerSubtitle?: string;
  showChevrons?: boolean;
  avatarImageUrl?: string;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: "1", label: "Menu Item #1" },
  { id: "2", label: "Menu Item #2" },
  { id: "3", label: "Menu Item #3" },
  { id: "4", label: "Menu Item #4" },
  { id: "5", label: "Menu Item #5" },
];

export function Menu({
  variant = "desktop",
  showMenu = true,
  showButton = true,
  menuItems = DEFAULT_MENU_ITEMS,
  headerTitle = "Title",
  headerSubtitle = "Subtitle",
  showChevrons = true,
  avatarImageUrl,
  className,
  style,
  ref,
  ...rest
}: MenuProps) {
  const themeContext = useThemeSafe();
  const theme = themeContext?.theme ?? "dark";
  const containerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--bg-page-primary)",
      borderTop: "var(--border-width-25) solid var(--border-neutral-primary)",
      borderRight: "var(--border-width-25) solid var(--border-neutral-primary)",
      borderBottom: "var(--border-width-25) solid var(--border-neutral-primary)",
      borderLeft: "var(--border-width-25) solid var(--border-neutral-primary)",
      position: "relative",
    };

    if (variant === "desktop") {
      return {
        ...baseStyles,
        width: "240px",
        height: "100%",
        borderLeft: "none",
        borderTop: "none",
        borderBottom: "none",
        borderRight: "var(--border-width-25) solid var(--border-neutral-primary)",
        padding: "var(--spacing-500) var(--spacing-400)",
        gap: "var(--spacing-none)",
      };
    }

    if (variant === "tablet-open" || variant === "tablet-closed") {
      return {
        ...baseStyles,
        width: "430px",
        borderTop: "none",
        borderRight: "none",
        borderBottom: "var(--border-width-25) solid var(--border-neutral-primary)",
        borderLeft: "none",
        padding: variant === "tablet-open" ? "var(--spacing-200) var(--spacing-400)" : "8px 0",
        gap: "var(--spacing-none)",
      };
    }

    if (variant === "mobile-open" || variant === "mobile-closed") {
      return {
        ...baseStyles,
        width: "400px",
        borderTop: "none",
        borderRight: "none",
        borderBottom: "var(--border-width-25) solid var(--border-neutral-primary)",
        borderLeft: "none",
        padding: variant === "mobile-open" ? "var(--spacing-200) var(--spacing-400)" : "var(--spacing-200) var(--spacing-none)",
        gap: "var(--spacing-none)",
      };
    }

    if (variant === "close-menu") {
      return {
        ...baseStyles,
        width: "100%",
        borderTop: "none",
        borderRight: "none",
        borderBottom: "var(--border-width-25) solid var(--border-neutral-primary)",
        borderLeft: "none",
        padding: "var(--spacing-200) var(--spacing-400)",
        alignItems: "flex-end",
        justifyContent: "center",
      };
    }

    return baseStyles;
  }, [variant]);

  const headerStyles = useMemo(() => {
    if (variant === "desktop") {
      return {
        display: "flex",
        gap: "var(--spacing-200)",
        alignItems: "center",
        padding: "var(--spacing-200)",
        borderRadius: "var(--corner-radius-100)",
        width: "100%",
      };
    }
    // For tablet/mobile, header is part of the main row
    return {
      display: "flex",
      gap: "var(--spacing-200)",
      alignItems: "center",
      padding: "var(--spacing-200)",
      borderRadius: "var(--corner-radius-100)",
      flex: 1,
    };
  }, [variant]);

  const avatarStyles = useMemo(() => {
    return {
      width: "48px",
      height: "48px",
      borderRadius: "var(--corner-radius-200)",
      backgroundColor: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      overflow: "hidden",
    };
  }, []);

  const menuItemStyles = useMemo(() => {
    return {
      display: "flex",
      gap: "var(--spacing-200)",
      alignItems: "center",
      padding: "var(--spacing-200) var(--spacing-200)",
      borderRadius: "var(--corner-radius-200)",
      backgroundColor: "var(--bg-page-primary)",
      width: "100%",
    };
  }, []);

  const buttonStyles = useMemo(() => {
    return {
      display: "flex",
      gap: "var(--spacing-200)",
      alignItems: "center",
      padding: "var(--spacing-200) var(--spacing-300)",
      borderRadius: "var(--corner-radius-200)",
      backgroundColor: "var(--bg-primary-tonal)",
      color: "var(--fg-primary-on-tonal)",
      fontFamily: "var(--font-secondary)",
      fontSize: "var(--body-small-text-size)",
      lineHeight: "var(--body-small-line-height)",
      fontWeight: "var(--font-weight-secondary-medium)",
      cursor: "pointer",
      width: variant === "desktop" ? "100%" : "92px",
    };
  }, [variant]);

  const footerStyles = useMemo(() => {
    if (variant === "desktop") {
      return {
        display: "flex",
        flexDirection: "column" as const,
        gap: "var(--spacing-400)",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "var(--spacing-400) var(--spacing-400) var(--spacing-200)",
        width: "100%",
      };
    }

    // For tablet/mobile, footer is part of the main row
    return {
      display: "flex",
      gap: "var(--spacing-300)",
      alignItems: "center",
      justifyContent: "flex-end",
    };
  }, [variant]);

  const mainRowStyles = useMemo(() => {
    if (variant === "desktop") {
      return {};
    }
    // For tablet/mobile, combine header and footer in one row
    return {
      display: "flex",
      alignItems: "center",
      width: "100%",
      gap: "var(--spacing-200)",
    };
  }, [variant]);

  const iconButtonStyles = useMemo(() => {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: "var(--corner-radius-full)",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      backgroundColor: "transparent",
      border: "none",
      color: "var(--fg-neutral)",
    };
  }, []);

  if (variant === "close-menu") {
    return (
      <div ref={ref} className={className} style={{ ...containerStyles, ...style }} {...rest}>
        <button style={iconButtonStyles}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px" }}>
            <CloseIcon size={32} />
          </div>
        </button>
      </div>
    );
  }

  const isDesktop = variant === "desktop";
  const isTabletOpen = variant === "tablet-open";
  const isMobileOpen = variant === "mobile-open";
  const isTabletClosed = variant === "tablet-closed";
  const isMobileClosed = variant === "mobile-closed";
  const showMenuItems = (isDesktop || isTabletOpen || isMobileOpen) && showMenu;
  const showHeaderContent = isDesktop || isTabletOpen || isTabletClosed;

  return (
    <div ref={ref} className={className} style={{ ...containerStyles, ...style }} {...rest}>
      {/* Desktop: Header and Footer are separate */}
      {isDesktop ? (
        <>
          {/* Header Section */}
          <div style={headerStyles}>
            <div style={avatarStyles}>
              {avatarImageUrl ? (
                <img
                  src={avatarImageUrl}
                  alt="User avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              ) : (
                <UserPersonIcon size={24} />
              )}
            </div>
            {showHeaderContent && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-none)", flex: 1 }}>
                <p
                  style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    lineHeight: "var(--body-small-line-height)",
                    fontWeight: "var(--font-weight-secondary-regular)",
                    color: "var(--fg-neutral)",
                    margin: 0,
                  }}
                >
                  {headerTitle}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "var(--body-regular-text-size)",
                    lineHeight: "var(--body-regular-line-height)",
                    fontWeight: "var(--font-weight-secondary-medium)",
                    color: "var(--fg-neutral)",
                    margin: 0,
                  }}
                >
                  {headerSubtitle}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Tablet/Mobile: Header and Footer in single row */
        <div style={mainRowStyles}>
          {/* Header Section */}
          <div style={headerStyles}>
            <div style={avatarStyles}>
              {avatarImageUrl ? (
                <img
                  src={avatarImageUrl}
                  alt="User avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              ) : (
                <UserPersonIcon size={24} />
              )}
            </div>
            {showHeaderContent && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-none)", flex: 1 }}>
                <p
                  style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "var(--body-small-text-size)",
                    lineHeight: "var(--body-small-line-height)",
                    fontWeight: "var(--font-weight-secondary-regular)",
                    color: "var(--fg-neutral)",
                    margin: 0,
                  }}
                >
                  {headerTitle}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-secondary)",
                    fontSize: "var(--body-regular-text-size)",
                    lineHeight: "var(--body-regular-line-height)",
                    fontWeight: "var(--font-weight-secondary-medium)",
                    color: "var(--fg-neutral)",
                    margin: 0,
                  }}
                >
                  {headerSubtitle}
                </p>
              </div>
            )}
          </div>

          {/* Footer with Button, Switch, and Icons */}
          <div style={footerStyles}>
            {showButton && (
              <div style={buttonStyles}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
                  <DownloadIcon size={16} />
                </div>
                <span>Button</span>
              </div>
            )}
            <Switch
              checked={theme === "dark"}
              showIcons={true}
            />
            <button style={iconButtonStyles}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px" }}>
                {(isTabletOpen || isMobileOpen) && <CloseIcon size={32} />}
                {(isTabletClosed || isMobileClosed) && <MenuIcon size={32} />}
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Menu Items */}
      {showMenuItems && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-200)",
            padding: isDesktop ? "var(--spacing-600) 0" : "var(--spacing-400) var(--spacing-200)",
            width: "100%",
            flex: isDesktop ? 1 : undefined,
          }}
        >
          {menuItems.map((item) => (
            <div key={item.id} style={menuItemStyles}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", flexShrink: 0, color: "var(--fg-neutral)" }}>
                <UserPersonIcon size={20} />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-secondary)",
                  fontSize: "var(--body-small-text-size)",
                  lineHeight: "var(--body-small-line-height)",
                  fontWeight: "var(--font-weight-secondary-medium)",
                  color: "var(--fg-neutral-secondary)",
                  margin: 0,
                  flex: 1,
                }}
              >
                {item.label}
              </p>
              {showChevrons && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", flexShrink: 0, color: "var(--fg-neutral)" }}>
                  <ChevronRightIcon size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Desktop Footer with Button and Switch */}
      {isDesktop && (
        <>
          {showButton && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-400)", padding: "var(--spacing-400)", width: "100%" }}>
              <div style={buttonStyles}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
                  <DownloadIcon size={16} />
                </div>
                <span>Button</span>
              </div>
            </div>
          )}
          <div style={footerStyles}>
            <Switch
              checked={theme === "dark"}
              showIcons={true}
            />
          </div>
        </>
      )}
    </div>
    );
}

