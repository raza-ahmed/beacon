"use client";

import { useMemo, ComponentPropsWithRef, useState, useCallback, useEffect, ReactNode } from "react";
import { UserPersonIcon, ChevronRightIcon, CloseIcon, MenuIcon, DownloadIcon } from "../icons";
import { Switch } from "./Switch";
import { useThemeSafe } from "../providers/ThemeProvider";
import { MenuItem as MenuItemComponent, MenuItemState } from "./MenuItem";

type MenuVariant = "desktop" | "tablet-open" | "tablet-closed" | "mobile-open" | "mobile-closed" | "close-menu";

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: (item: MenuItem) => void;
}

export interface SwitchRenderProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface ToggleButtonRenderProps {
  isOpen: boolean;
  onClick: () => void;
}

export interface MenuButtonRenderProps {
  onClick: () => void;
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
  selectedItemId?: string;
  onItemClick?: (item: MenuItem) => void;
  renderSwitch?: (props: SwitchRenderProps) => ReactNode;
  renderToggleButton?: (props: ToggleButtonRenderProps) => ReactNode;
  renderButton?: (props: MenuButtonRenderProps) => ReactNode;
  onSwitchChange?: (checked: boolean) => void;
  onToggleButtonClick?: () => void;
  onButtonClick?: () => void;
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
  selectedItemId,
  onItemClick,
  renderSwitch,
  renderToggleButton,
  renderButton,
  onSwitchChange,
  onToggleButtonClick,
  onButtonClick,
  className,
  style,
  ref,
  ...rest
}: MenuProps) {
  const themeContext = useThemeSafe();
  const theme = themeContext?.theme ?? "dark";
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [switchChecked, setSwitchChecked] = useState<boolean>(theme === "dark");
  
  // Update switch checked state when theme changes
  useEffect(() => {
    setSwitchChecked(theme === "dark");
  }, [theme]);

  const handleSwitchChange = useCallback((checked: boolean) => {
    setSwitchChecked(checked);
    if (onSwitchChange) {
      onSwitchChange(checked);
    }
  }, [onSwitchChange]);

  const handleToggleButtonClick = useCallback(() => {
    if (onToggleButtonClick) {
      onToggleButtonClick();
    }
  }, [onToggleButtonClick]);

  const handleButtonClick = useCallback(() => {
    if (onButtonClick) {
      onButtonClick();
    }
  }, [onButtonClick]);
  const containerStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--bg-page-base)",
      borderTop: "var(--border-width-25) solid var(--border-strong-100)",
      borderRight: "var(--border-width-25) solid var(--border-strong-100)",
      borderBottom: "var(--border-width-25) solid var(--border-strong-100)",
      borderLeft: "var(--border-width-25) solid var(--border-strong-100)",
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
        borderRight: "var(--border-width-25) solid var(--border-strong-100)",
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
        borderBottom: "var(--border-width-25) solid var(--border-strong-100)",
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
        borderBottom: "var(--border-width-25) solid var(--border-strong-100)",
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
        borderBottom: "var(--border-width-25) solid var(--border-strong-100)",
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
        {renderToggleButton ? (
          renderToggleButton({ isOpen: true, onClick: handleToggleButtonClick })
        ) : (
          <button style={iconButtonStyles} onClick={handleToggleButtonClick}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px" }}>
              <CloseIcon size={32} />
            </div>
          </button>
        )}
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
              <img
                src={avatarImageUrl || "/images/avatars/avatar-female.png"}
                alt="User avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const iconContainer = target.parentElement;
                  if (iconContainer && !iconContainer.querySelector("svg")) {
                    const iconWrapper = document.createElement("div");
                    iconWrapper.style.display = "flex";
                    iconWrapper.style.alignItems = "center";
                    iconWrapper.style.justifyContent = "center";
                    iconWrapper.style.width = "100%";
                    iconWrapper.style.height = "100%";
                    iconWrapper.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="var(--fg-neutral)"/></svg>`;
                    iconContainer.appendChild(iconWrapper);
                  }
                }}
              />
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
              <img
                src={avatarImageUrl || "/images/avatars/avatar-female.png"}
                alt="User avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const iconContainer = target.parentElement;
                  if (iconContainer && !iconContainer.querySelector("svg")) {
                    const iconWrapper = document.createElement("div");
                    iconWrapper.style.display = "flex";
                    iconWrapper.style.alignItems = "center";
                    iconWrapper.style.justifyContent = "center";
                    iconWrapper.style.width = "100%";
                    iconWrapper.style.height = "100%";
                    iconWrapper.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="var(--fg-neutral)"/></svg>`;
                    iconContainer.appendChild(iconWrapper);
                  }
                }}
              />
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
              renderButton ? (
                renderButton({ onClick: handleButtonClick })
              ) : (
                <div style={buttonStyles} onClick={handleButtonClick}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
                    <DownloadIcon size={16} />
                  </div>
                  <span>Button</span>
                </div>
              )
            )}
            {renderSwitch ? (
              renderSwitch({ checked: switchChecked, onChange: handleSwitchChange })
            ) : (
              <Switch
                checked={switchChecked}
                onChange={handleSwitchChange}
                showIcons={true}
              />
            )}
            {renderToggleButton ? (
              renderToggleButton({ 
                isOpen: isTabletOpen || isMobileOpen, 
                onClick: handleToggleButtonClick 
              })
            ) : (
              <button style={iconButtonStyles} onClick={handleToggleButtonClick}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px" }}>
                  {(isTabletOpen || isMobileOpen) && <CloseIcon size={32} />}
                  {(isTabletClosed || isMobileClosed) && <MenuIcon size={32} />}
                </div>
              </button>
            )}
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
          {menuItems.map((item) => {
            const isSelected = selectedItemId === item.id || item.selected === true;
            const isHovered = hoveredItemId === item.id;
            
            const handleClick = () => {
              if (item.onClick) {
                item.onClick(item);
              }
              if (onItemClick) {
                onItemClick(item);
              }
            };

            const handleMouseEnter = () => {
              setHoveredItemId(item.id);
            };

            const handleMouseLeave = () => {
              setHoveredItemId(null);
            };

            // Determine state for MenuItem component
            const itemState: MenuItemState = isSelected ? "Active" : isHovered ? "Hovered" : "Default";

            return (
              <MenuItemComponent
                key={item.id}
                menuTitle={item.label}
                iconStart={true}
                iconStart1={item.icon || null}
                iconEnd={showChevrons}
                iconEnd1={null}
                state={itemState}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>
      )}

      {/* Desktop Footer with Button and Switch */}
      {isDesktop && (
        <>
          {showButton && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-400)", padding: "var(--spacing-400)", width: "100%" }}>
              {renderButton ? (
                renderButton({ onClick: handleButtonClick })
              ) : (
                <div style={buttonStyles} onClick={handleButtonClick}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px" }}>
                    <DownloadIcon size={16} />
                  </div>
                  <span>Button</span>
                </div>
              )}
            </div>
          )}
          <div style={footerStyles}>
            {renderSwitch ? (
              renderSwitch({ checked: switchChecked, onChange: handleSwitchChange })
            ) : (
              <Switch
                checked={switchChecked}
                onChange={handleSwitchChange}
                showIcons={true}
              />
            )}
          </div>
        </>
      )}
    </div>
    );
}

