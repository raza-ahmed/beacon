"use client";

import { useMemo, ComponentPropsWithRef, ReactElement, cloneElement, isValidElement } from "react";
import { useThemeSafe } from "../providers/ThemeProvider";
import type { TabItemProps } from "./TabItem";

export interface TabProps extends ComponentPropsWithRef<"div"> {
  children: ReactElement<TabItemProps> | ReactElement<TabItemProps>[];
  size?: TabItemProps["size"];
  tabStyle?: TabItemProps["tabStyle"];
}

export function Tab({
  children,
  size = "sm",
  tabStyle = "default",
  className,
  style: inlineStyle,
  ...rest
}: TabProps) {
  useThemeSafe();

  const containerStyles = useMemo(() => {
    return {
      display: "inline-flex",
      gap: 0,
      backgroundColor: "var(--bg-page-primary)",
      border: "var(--border-width-25) solid var(--border-strong-200)",
      borderRadius: tabStyle === "pill" ? "var(--corner-radius-200)" : "var(--corner-radius-200)",
      padding: "2px",
      overflow: "hidden",
      ...inlineStyle,
    } as React.CSSProperties;
  }, [tabStyle, inlineStyle]);

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div className={className} style={containerStyles} role="tablist" {...rest}>
      {childrenArray.map((child, index) => {
        if (isValidElement<TabItemProps>(child)) {
          return cloneElement(child, {
            key: child.key || index,
            size: child.props.size ?? size,
            tabStyle: child.props.tabStyle ?? tabStyle,
          });
        }
        return child;
      })}
    </div>
  );
}
