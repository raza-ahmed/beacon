// Icon components for the design system
import React from "react";

interface IconProps {
  size?: number | IconSize;
  className?: string;
}

type IconSize = "xs" | "sm" | "rg" | "md" | "lg" | "xl" | "2xl";

function iconSizeVar(size: IconSize) {
  return `var(--icon-size-${size})`;
}

/**
 * CSS variables are not valid in SVG width/height attributes in browsers.
 * For token sizes, apply width/height via style instead of attributes.
 */
function getSvgSizeProps(size: number | IconSize) {
  if (typeof size === "number") {
    return {
      width: size,
      height: size,
      style: undefined as React.CSSProperties | undefined,
    };
  }

  const v = iconSizeVar(size);
  return {
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    style: { width: v, height: v } as React.CSSProperties,
  };
}

export function BeaconIcon({ size = "rg", className }: IconProps) {
  const { width, height, style } = getSvgSizeProps(size);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M12 1C5.9 1 1 6 1 12.1C1 18.2 4.7 21.9 9.7 23V13.7C9.7 12.3 10.9 11.1 12.3 11.1C13.7 11.1 14.9 12.3 14.9 13.7V22.8C19.6 21.5 23.1 17.2 23.1 12C23.1 6.8 18.1 1 12 1ZM18.2 10.2C18 10.3 17.7 10.4 17.5 10.4C17 10.4 16.6 10.2 16.3 9.7C15.4 8.1 13.8 7.2 12 7.2C10.2 7.2 8.6 8.2 7.7 9.7C7.3 10.4 6.5 10.6 5.8 10.2C5.1 9.8 4.9 9 5.3 8.3C6 7.1 6.9 6.2 8.1 5.5C9.3 4.8 10.6 4.4 12 4.4C13.4 4.4 14.7 4.8 15.9 5.5C17 6.2 18 7.2 18.7 8.3C19.1 9 18.9 9.8 18.2 10.2Z"
        fill="var(--fg-primary)"
      />
    </svg>

  );
}

export function SearchIcon({ size = "xs", className }: IconProps) {
  const { width, height, style } = getSvgSizeProps(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PaletteIcon({ size = "xs", className }: IconProps) {
  const { width, height, style } = getSvgSizeProps(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1.333A6.667 6.667 0 0 0 1.333 8a6.667 6.667 0 0 0 6.667 6.667c.553 0 1-.447 1-1 0-.26-.107-.493-.267-.667a.988.988 0 0 1-.266-.666c0-.554.446-1 1-1h1.2a3.733 3.733 0 0 0 3.733-3.734A6.667 6.667 0 0 0 8 1.333Z"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4.667" cy="8" r="1" fill="currentColor" />
      <circle cx="6.667" cy="5.333" r="1" fill="currentColor" />
      <circle cx="9.333" cy="5.333" r="1" fill="currentColor" />
      <circle cx="11.333" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

export function ChevronDownIcon({ size = "xs", className }: IconProps) {
  const { width, height, style } = getSvgSizeProps(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronUpIcon({ size = "xs", className }: IconProps) {
  const { width, height, style } = getSvgSizeProps(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m4 10 4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.33"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SunIcon({ size = "rg", className }: IconProps) {
  const { width, height, style } = getSvgSizeProps(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ size = "rg", className }: IconProps) {
  const { width, height, style } = getSvgSizeProps(size);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

