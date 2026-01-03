"use client";

import { useEffect, useMemo, useState } from "react";
import { PageLayout, type TocItem } from "@/components";
import { useTheme } from "@/providers/ThemeProvider";
import type { HueVariant, Theme } from "@/tokens/types";
import { TokenCopyButton } from "@/components/TokenCopyButton";

type TokenKind = "bg" | "fg" | "border" | "static" | "util" | "shadow" | "palette";

interface TokenSpec {
  kind: TokenKind;
  cssVar: `--${string}`;
  label: string;
  guidance?: string;
  preview?: {
    backgroundVar?: `--${string}`;
    foregroundVar?: `--${string}`;
    borderVar?: `--${string}`;
    overlayOnVar?: `--${string}`; // overlay shown on top of another surface
  };
}

interface TokenGroup {
  id: string;
  title: string;
  description?: string;
  kind: TokenKind;
  tokens: TokenSpec[];
}

interface PaletteFamily {
  id: string;
  title: string;
  description?: string;
  vars: `--${string}`[];
}

const HUE_OPTIONS: { value: HueVariant; label: string }[] = [
  { value: "chromatic-prime", label: "Chromatic" },
  { value: "hue-sky", label: "Hue Sky" },
  { value: "hue-indigo", label: "Hue Indigo" },
];

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

function cssVarValue(cssVar: `--${string}`): string {
  return `var(${cssVar})`;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback: create a temporary textarea for older browsers / restricted contexts.
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

function parseVarFunction(input: string): { name: `--${string}`; fallback?: string } | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith("var(")) return null;
  // Support: var(--token) or var(--token, fallback)
  const m = trimmed.match(/^var\(\s*(--[^,\s)]+)\s*(?:,\s*([^)]+))?\s*\)$/);
  if (!m) return null;
  return { name: m[1] as `--${string}`, fallback: m[2]?.trim() };
}

function resolveCssVarValue(
  cssVar: `--${string}`,
  computed: Record<string, string>,
  depth = 0
): string {
  if (depth > 12) return computed[cssVar] ?? "";
  const raw = (computed[cssVar] ?? "").trim();
  if (!raw) return "";

  const parsed = parseVarFunction(raw);
  if (!parsed) return raw;

  const next = computed[parsed.name]?.trim();
  if (next) return resolveCssVarValue(parsed.name, computed, depth + 1);

  if (parsed.fallback) {
    const fallbackParsed = parseVarFunction(parsed.fallback);
    if (fallbackParsed) return resolveCssVarValue(fallbackParsed.name, computed, depth + 1);
    return parsed.fallback;
  }

  return raw;
}

type RGBA = { r: number; g: number; b: number; a: number };

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function parseHexColor(hex: string): RGBA | null {
  const h = hex.trim().replace(/^#/, "");
  if (![3, 4, 6, 8].includes(h.length)) return null;

  const toByte = (s: string) => Number.parseInt(s, 16);

  if (h.length === 3) {
    const r = toByte(h[0] + h[0]);
    const g = toByte(h[1] + h[1]);
    const b = toByte(h[2] + h[2]);
    return { r, g, b, a: 1 };
  }

  if (h.length === 4) {
    const r = toByte(h[0] + h[0]);
    const g = toByte(h[1] + h[1]);
    const b = toByte(h[2] + h[2]);
    const a = toByte(h[3] + h[3]) / 255;
    return { r, g, b, a: clamp01(a) };
  }

  if (h.length === 6) {
    const r = toByte(h.slice(0, 2));
    const g = toByte(h.slice(2, 4));
    const b = toByte(h.slice(4, 6));
    return { r, g, b, a: 1 };
  }

  const r = toByte(h.slice(0, 2));
  const g = toByte(h.slice(2, 4));
  const b = toByte(h.slice(4, 6));
  const a = toByte(h.slice(6, 8)) / 255;
  return { r, g, b, a: clamp01(a) };
}

function parseRgbColor(value: string): RGBA | null {
  const v = value.trim();
  const m = v.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*(?:,\s*([0-9.]+)\s*)?\)$/i);
  if (!m) return null;
  const r = Math.round(Number(m[1]));
  const g = Math.round(Number(m[2]));
  const b = Math.round(Number(m[3]));
  const a = m[4] === undefined ? 1 : clamp01(Number(m[4]));
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b, a };
}

function parseColor(value: string): RGBA | null {
  const v = value.trim();
  if (!v) return null;
  if (v === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  if (v.startsWith("#")) return parseHexColor(v);
  if (v.startsWith("rgb")) return parseRgbColor(v);
  return null;
}

function compositeOver(bg: RGBA, fg: RGBA): RGBA {
  // Standard alpha compositing: result = fg over bg
  const a = fg.a + bg.a * (1 - fg.a);
  if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 };
  const r = (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a;
  const g = (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a;
  const b = (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a;
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a: clamp01(a) };
}

function relativeLuminance(rgb: RGBA): number {
  // Assume rgb is effectively opaque for luminance. If not, caller should composite first.
  const srgb = [rgb.r, rgb.g, rgb.b].map((c) => c / 255);
  const lin = srgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrastRatio(bg: RGBA, fg: RGBA): number | null {
  // Composite foreground over background if needed.
  const bgOpaque = bg.a < 1 ? compositeOver({ r: 255, g: 255, b: 255, a: 1 }, bg) : bg;
  const fgOverBg = fg.a < 1 ? compositeOver(bgOpaque, fg) : fg;
  const L1 = relativeLuminance(bgOpaque);
  const L2 = relativeLuminance(fgOverBg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  if (!Number.isFinite(ratio)) return null;
  return Math.round(ratio * 100) / 100;
}

function useBrandTokenGroups(): TokenGroup[] {
  return useMemo(() => {
    // Inventory mirrors generated brand CSS vars in:
    // - src/tokens/generated/brand-light.css
    // - src/tokens/generated/brand-dark.css
    const background: TokenSpec[] = [
      {
        kind: "bg",
        cssVar: "--bg-page-primary",
        label: "Page Primary",
        guidance: "Default app background for main surfaces.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "bg",
        cssVar: "--bg-page-secondary",
        label: "Page Secondary",
        guidance: "Secondary surface background for grouped content.",
        preview: { backgroundVar: "--bg-page-secondary", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "bg",
        cssVar: "--bg-page-tertiary",
        label: "Page Tertiary",
        guidance: "Tertiary surface background for subtle elevation.",
        preview: { backgroundVar: "--bg-page-tertiary", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "bg",
        cssVar: "--bg-white",
        label: "White Surface (Brand)",
        guidance: "A “white” surface role that adapts to theme.",
        preview: { backgroundVar: "--bg-white", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "bg",
        cssVar: "--bg-disabled",
        label: "Disabled Background",
        guidance: "Background for disabled containers or controls.",
        preview: { backgroundVar: "--bg-disabled", foregroundVar: "--fg-disabled", borderVar: "--border-disabled" },
      },
      {
        kind: "bg",
        cssVar: "--bg-transparent",
        label: "Transparent Background",
        guidance: "Transparent background role (use for overlays/ghost elements).",
        preview: { backgroundVar: "--bg-transparent", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "bg",
        cssVar: "--bg-primary",
        label: "Brand",
        guidance: "Primary brand action background.",
        preview: { backgroundVar: "--bg-primary", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-primary-on-hover",
        label: "Brand Hover",
        guidance: "Hover background for primary brand actions.",
        preview: { backgroundVar: "--bg-primary-on-hover", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-primary-pressed",
        label: "Brand Pressed",
        guidance: "Pressed background for primary brand actions.",
        preview: { backgroundVar: "--bg-primary-pressed", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-primary-on-focused",
        label: "Brand Focus",
        guidance: "Focus background for primary brand actions (when specified).",
        preview: { backgroundVar: "--bg-primary-on-focused", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-primary-disabled",
        label: "Brand Disabled",
        guidance: "Disabled background for brand actions.",
        preview: { backgroundVar: "--bg-primary-disabled", foregroundVar: "--fg-on-disabled", borderVar: "--border-disabled" },
      },
      {
        kind: "bg",
        cssVar: "--bg-primary-tonal",
        label: "Brand Tonal",
        guidance: "Tonal brand surface (subtle emphasis).",
        preview: { backgroundVar: "--bg-primary-tonal", foregroundVar: "--fg-primary-on-tonal", borderVar: "--border-primary-tonal" },
      },
      {
        kind: "bg",
        cssVar: "--bg-primary-tonal-on-hover",
        label: "Brand Tonal Hover",
        guidance: "Hover state for tonal brand surfaces.",
        preview: { backgroundVar: "--bg-primary-tonal-on-hover", foregroundVar: "--fg-primary-on-tonal", borderVar: "--border-primary-tonal" },
      },
      {
        kind: "bg",
        cssVar: "--bg-primary-dark",
        label: "Brand Dark",
        guidance: "High-contrast brand surface role (when specified).",
        preview: { backgroundVar: "--bg-primary-dark", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-success",
        label: "Success",
        guidance: "Success status background.",
        preview: { backgroundVar: "--bg-success", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-success-on-hover",
        label: "Success Hover",
        guidance: "Hover background for success actions.",
        preview: { backgroundVar: "--bg-success-on-hover", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-success-tonal",
        label: "Success Tonal",
        guidance: "Tonal success surface (banners, subtle callouts).",
        preview: { backgroundVar: "--bg-success-tonal", foregroundVar: "--fg-success-on-tonal", borderVar: "--border-success-tonal" },
      },
      {
        kind: "bg",
        cssVar: "--bg-success-dark",
        label: "Success Dark",
        guidance: "High-contrast success surface role (when specified).",
        preview: { backgroundVar: "--bg-success-dark", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-warning",
        label: "Warning",
        guidance: "Warning status background.",
        preview: { backgroundVar: "--bg-warning", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-warning-on-hover",
        label: "Warning Hover",
        guidance: "Hover background for warning actions.",
        preview: { backgroundVar: "--bg-warning-on-hover", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-warning-tonal",
        label: "Warning Tonal",
        guidance: "Tonal warning surface (banners, subtle callouts).",
        preview: { backgroundVar: "--bg-warning-tonal", foregroundVar: "--fg-warning-on-tonal", borderVar: "--border-warning-tonal" },
      },
      {
        kind: "bg",
        cssVar: "--bg-warning-dark",
        label: "Warning Dark",
        guidance: "High-contrast warning surface role (when specified).",
        preview: { backgroundVar: "--bg-warning-dark", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-critical",
        label: "Critical",
        guidance: "Critical/error status background.",
        preview: { backgroundVar: "--bg-critical", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-critical-on-hover",
        label: "Critical Hover",
        guidance: "Hover background for critical actions.",
        preview: { backgroundVar: "--bg-critical-on-hover", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "bg",
        cssVar: "--bg-critical-tonal",
        label: "Critical Tonal",
        guidance: "Tonal critical surface (banners, subtle callouts).",
        preview: { backgroundVar: "--bg-critical-tonal", foregroundVar: "--fg-critical-on-tonal", borderVar: "--border-critical-tonal" },
      },
      {
        kind: "bg",
        cssVar: "--bg-critical-dark",
        label: "Critical Dark",
        guidance: "High-contrast critical surface role (when specified).",
        preview: { backgroundVar: "--bg-critical-dark", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
    ];

    const foreground: TokenSpec[] = [
      {
        kind: "fg",
        cssVar: "--fg-neutral",
        label: "Neutral",
        guidance: "Default text color for reading.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "fg",
        cssVar: "--fg-neutral-secondary",
        label: "Neutral Secondary",
        guidance: "Secondary text (supporting content, metadata).",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral-secondary", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "fg",
        cssVar: "--fg-neutral-tertiary",
        label: "Neutral Tertiary",
        guidance: "Tertiary text (helper text, quiet labels).",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral-tertiary", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "fg",
        cssVar: "--fg-primary",
        label: "Primary",
        guidance: "Brand foreground (links, accents).",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary", borderVar: "--border-primary" },
      },
      {
        kind: "fg",
        cssVar: "--fg-primary-on-hover",
        label: "Primary Hover",
        guidance: "Hover foreground for brand accents.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary-on-hover", borderVar: "--border-primary" },
      },
      {
        kind: "fg",
        cssVar: "--fg-primary-pressed",
        label: "Primary Pressed",
        guidance: "Pressed foreground for brand accents.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary-pressed", borderVar: "--border-primary" },
      },
      {
        kind: "fg",
        cssVar: "--fg-primary-on-focus",
        label: "Primary Focus",
        guidance: "Focus foreground for brand accents (when specified).",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary-on-focus", borderVar: "--border-primary" },
      },
      {
        kind: "fg",
        cssVar: "--fg-primary-tonal",
        label: "Primary Tonal",
        guidance: "Foreground on tonal brand surfaces (paired with tonal roles).",
        preview: { backgroundVar: "--bg-primary-tonal", foregroundVar: "--fg-primary-tonal", borderVar: "--border-primary-tonal" },
      },
      {
        kind: "fg",
        cssVar: "--fg-primary-on-tonal",
        label: "Primary On Tonal",
        guidance: "Readable text/icon color on tonal brand surfaces.",
        preview: { backgroundVar: "--bg-primary-tonal", foregroundVar: "--fg-primary-on-tonal", borderVar: "--border-primary-tonal" },
      },
      {
        kind: "fg",
        cssVar: "--fg-primary-disabled",
        label: "Primary Disabled",
        guidance: "Disabled foreground for brand accents.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary-disabled", borderVar: "--border-primary-disabled" },
      },
      {
        kind: "fg",
        cssVar: "--fg-critical",
        label: "Critical",
        guidance: "Critical foreground (errors, destructive actions).",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-critical", borderVar: "--border-critical" },
      },
      {
        kind: "fg",
        cssVar: "--fg-critical-tonal",
        label: "Critical Tonal",
        guidance: "Foreground on tonal critical surfaces.",
        preview: { backgroundVar: "--bg-critical-tonal", foregroundVar: "--fg-critical-tonal", borderVar: "--border-critical-tonal" },
      },
      {
        kind: "fg",
        cssVar: "--fg-critical-on-tonal",
        label: "Critical On Tonal",
        guidance: "Readable text/icon color on tonal critical surfaces.",
        preview: { backgroundVar: "--bg-critical-tonal", foregroundVar: "--fg-critical-on-tonal", borderVar: "--border-critical-tonal" },
      },
      {
        kind: "fg",
        cssVar: "--fg-warning",
        label: "Warning",
        guidance: "Warning foreground.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-warning", borderVar: "--border-warning" },
      },
      {
        kind: "fg",
        cssVar: "--fg-warning-tonal",
        label: "Warning Tonal",
        guidance: "Foreground on tonal warning surfaces.",
        preview: { backgroundVar: "--bg-warning-tonal", foregroundVar: "--fg-warning-tonal", borderVar: "--border-warning-tonal" },
      },
      {
        kind: "fg",
        cssVar: "--fg-warning-on-tonal",
        label: "Warning On Tonal",
        guidance: "Readable text/icon color on tonal warning surfaces.",
        preview: { backgroundVar: "--bg-warning-tonal", foregroundVar: "--fg-warning-on-tonal", borderVar: "--border-warning-tonal" },
      },
      {
        kind: "fg",
        cssVar: "--fg-success",
        label: "Success",
        guidance: "Success foreground.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-success", borderVar: "--border-success" },
      },
      {
        kind: "fg",
        cssVar: "--fg-success-tonal",
        label: "Success Tonal",
        guidance: "Foreground on tonal success surfaces.",
        preview: { backgroundVar: "--bg-success-tonal", foregroundVar: "--fg-success-tonal", borderVar: "--border-success-tonal" },
      },
      {
        kind: "fg",
        cssVar: "--fg-success-on-tonal",
        label: "Success On Tonal",
        guidance: "Readable text/icon color on tonal success surfaces.",
        preview: { backgroundVar: "--bg-success-tonal", foregroundVar: "--fg-success-on-tonal", borderVar: "--border-success-tonal" },
      },
      {
        kind: "fg",
        cssVar: "--fg-on-action",
        label: "On Action",
        guidance: "High-contrast foreground on strong action backgrounds.",
        preview: { backgroundVar: "--bg-primary", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "fg",
        cssVar: "--fg-white",
        label: "White",
        guidance: "White foreground role (for high-contrast cases).",
        preview: { backgroundVar: "--bg-primary", foregroundVar: "--fg-white", borderVar: "--border-on-action" },
      },
      {
        kind: "fg",
        cssVar: "--fg-disabled",
        label: "Disabled",
        guidance: "Disabled text/icon foreground.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-disabled", borderVar: "--border-disabled" },
      },
      {
        kind: "fg",
        cssVar: "--fg-on-disabled",
        label: "On Disabled",
        guidance: "Foreground used on disabled surfaces (paired with disabled background).",
        preview: { backgroundVar: "--bg-disabled", foregroundVar: "--fg-on-disabled", borderVar: "--border-disabled" },
      },
    ];

    const border: TokenSpec[] = [
      {
        kind: "border",
        cssVar: "--border-neutral-primary",
        label: "Neutral Primary",
        guidance: "Primary neutral border for controls and containers.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-primary" },
      },
      {
        kind: "border",
        cssVar: "--border-neutral-secondary",
        label: "Neutral Secondary",
        guidance: "Secondary neutral border for subtle separation.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "border",
        cssVar: "--border-neutral-tertiary",
        label: "Neutral Tertiary",
        guidance: "Tertiary border for light dividers.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-tertiary" },
      },
      {
        kind: "border",
        cssVar: "--border-strong",
        label: "Strong",
        guidance: "Strong outline for high emphasis separation.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral", borderVar: "--border-strong" },
      },
      {
        kind: "border",
        cssVar: "--border-strong-100",
        label: "Strong 100",
        guidance: "Strong border with alpha (light emphasis).",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral", borderVar: "--border-strong-100" },
      },
      {
        kind: "border",
        cssVar: "--border-strong-200",
        label: "Strong 200",
        guidance: "Strong border with alpha (medium emphasis).",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-neutral", borderVar: "--border-strong-200" },
      },
      {
        kind: "border",
        cssVar: "--border-primary",
        label: "Primary",
        guidance: "Brand border for focused/active elements.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary", borderVar: "--border-primary" },
      },
      {
        kind: "border",
        cssVar: "--border-primary-on-hover",
        label: "Primary Hover",
        guidance: "Hover border for brand accents.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary", borderVar: "--border-primary-on-hover" },
      },
      {
        kind: "border",
        cssVar: "--border-primary-pressed",
        label: "Primary Pressed",
        guidance: "Pressed border for brand accents.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary", borderVar: "--border-primary-pressed" },
      },
      {
        kind: "border",
        cssVar: "--border-primary-disabled",
        label: "Primary Disabled",
        guidance: "Disabled border for brand accents.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-primary-disabled", borderVar: "--border-primary-disabled" },
      },
      {
        kind: "border",
        cssVar: "--border-primary-tonal",
        label: "Primary Tonal",
        guidance: "Border on tonal brand surfaces.",
        preview: { backgroundVar: "--bg-primary-tonal", foregroundVar: "--fg-primary-on-tonal", borderVar: "--border-primary-tonal" },
      },
      {
        kind: "border",
        cssVar: "--border-success",
        label: "Success",
        guidance: "Success border.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-success", borderVar: "--border-success" },
      },
      {
        kind: "border",
        cssVar: "--border-success-tonal",
        label: "Success Tonal",
        guidance: "Border on tonal success surfaces.",
        preview: { backgroundVar: "--bg-success-tonal", foregroundVar: "--fg-success-on-tonal", borderVar: "--border-success-tonal" },
      },
      {
        kind: "border",
        cssVar: "--border-warning",
        label: "Warning",
        guidance: "Warning border.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-warning", borderVar: "--border-warning" },
      },
      {
        kind: "border",
        cssVar: "--border-warning-tonal",
        label: "Warning Tonal",
        guidance: "Border on tonal warning surfaces.",
        preview: { backgroundVar: "--bg-warning-tonal", foregroundVar: "--fg-warning-on-tonal", borderVar: "--border-warning-tonal" },
      },
      {
        kind: "border",
        cssVar: "--border-critical",
        label: "Critical",
        guidance: "Critical border.",
        preview: { backgroundVar: "--bg-page-primary", foregroundVar: "--fg-critical", borderVar: "--border-critical" },
      },
      {
        kind: "border",
        cssVar: "--border-critical-tonal",
        label: "Critical Tonal",
        guidance: "Border on tonal critical surfaces.",
        preview: { backgroundVar: "--bg-critical-tonal", foregroundVar: "--fg-critical-on-tonal", borderVar: "--border-critical-tonal" },
      },
      {
        kind: "border",
        cssVar: "--border-on-action",
        label: "On Action",
        guidance: "Border/outline on strong action backgrounds (for contrast).",
        preview: { backgroundVar: "--bg-primary", foregroundVar: "--fg-on-action", borderVar: "--border-on-action" },
      },
      {
        kind: "border",
        cssVar: "--border-white",
        label: "White",
        guidance: "White border role (for high-contrast cases).",
        preview: { backgroundVar: "--bg-primary", foregroundVar: "--fg-on-action", borderVar: "--border-white" },
      },
      {
        kind: "border",
        cssVar: "--border-disabled",
        label: "Disabled",
        guidance: "Disabled borders.",
        preview: { backgroundVar: "--bg-disabled", foregroundVar: "--fg-on-disabled", borderVar: "--border-disabled" },
      },
    ];

    const staticTokens: TokenSpec[] = [
      {
        kind: "static",
        cssVar: "--static-white",
        label: "Static White",
        guidance: "Absolute white (non-adaptive).",
        preview: { backgroundVar: "--static-white", foregroundVar: "--static-black", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "static",
        cssVar: "--static-black",
        label: "Static Black",
        guidance: "Absolute black (non-adaptive).",
        preview: { backgroundVar: "--static-black", foregroundVar: "--static-white", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "static",
        cssVar: "--static-primary",
        label: "Static Primary",
        guidance: "Absolute primary (non-adaptive).",
        preview: { backgroundVar: "--static-primary", foregroundVar: "--static-white", borderVar: "--border-on-action" },
      },
      {
        kind: "static",
        cssVar: "--static-light-on-dark",
        label: "Static Light on Dark",
        guidance: "Light-on-dark role for static compositions.",
        preview: { backgroundVar: "--static-light-on-dark", foregroundVar: "--static-white", borderVar: "--border-neutral-secondary" },
      },
    ];

    const util: TokenSpec[] = [
      {
        kind: "util",
        cssVar: "--util-overlay-dull",
        label: "Overlay Dull",
        guidance: "Dull overlay for subtle dimming.",
        preview: { overlayOnVar: "--bg-page-primary", backgroundVar: "--util-overlay-dull", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "util",
        cssVar: "--util-overlay-light",
        label: "Overlay Light",
        guidance: "Light overlay for dimming surfaces.",
        preview: { overlayOnVar: "--bg-page-primary", backgroundVar: "--util-overlay-light", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "util",
        cssVar: "--util-overlay-medium",
        label: "Overlay Medium",
        guidance: "Medium overlay for modals/drawers.",
        preview: { overlayOnVar: "--bg-page-primary", backgroundVar: "--util-overlay-medium", foregroundVar: "--fg-white", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "util",
        cssVar: "--util-overlay-strong",
        label: "Overlay Strong",
        guidance: "Strong overlay for focus/attention lock.",
        preview: { overlayOnVar: "--bg-page-primary", backgroundVar: "--util-overlay-strong", foregroundVar: "--fg-white", borderVar: "--border-neutral-secondary" },
      },
    ];

    const shadow: TokenSpec[] = [
      {
        kind: "shadow",
        cssVar: "--shadow-none",
        label: "Shadow None",
        guidance: "Shadow color for no/transparent shadow.",
        preview: { backgroundVar: "--shadow-none", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "shadow",
        cssVar: "--shadow-subtle",
        label: "Shadow Subtle",
        guidance: "Shadow color for subtle elevation.",
        preview: { backgroundVar: "--shadow-subtle", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "shadow",
        cssVar: "--shadow-normal",
        label: "Shadow Normal",
        guidance: "Shadow color for normal elevation.",
        preview: { backgroundVar: "--shadow-normal", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "shadow",
        cssVar: "--shadow-medium",
        label: "Shadow Medium",
        guidance: "Shadow color for medium elevation.",
        preview: { backgroundVar: "--shadow-medium", foregroundVar: "--fg-neutral", borderVar: "--border-neutral-secondary" },
      },
      {
        kind: "shadow",
        cssVar: "--shadow-strong",
        label: "Shadow Strong",
        guidance: "Shadow color for strong elevation.",
        preview: { backgroundVar: "--shadow-strong", foregroundVar: "--fg-white", borderVar: "--border-neutral-secondary" },
      },
    ];

    return [
      {
        id: "tokens-background",
        title: "Background",
        description: "Surface and status backgrounds. Use these for containers, fills, and stateful backgrounds.",
        kind: "bg",
        tokens: background,
      },
      {
        id: "tokens-foreground",
        title: "Foreground",
        description: "Text and icon colors. Use these for readable content and semantic emphasis.",
        kind: "fg",
        tokens: foreground,
      },
      {
        id: "tokens-border",
        title: "Border",
        description: "Stroke colors. Use these for outlines, dividers, and focus/active borders.",
        kind: "border",
        tokens: border,
      },
      {
        id: "tokens-static",
        title: "Static",
        description: "Non-adaptive colors for specific cases where theme switching must not change the output.",
        kind: "static",
        tokens: staticTokens,
      },
      {
        id: "tokens-utilities",
        title: "Utilities",
        description: "Overlay colors and utility roles (commonly for backdrops and focus lock).",
        kind: "util",
        tokens: util,
      },
      {
        id: "tokens-shadows",
        title: "Shadows",
        description: "Shadow color tokens used by effect tokens (e.g., drop shadows).",
        kind: "shadow",
        tokens: shadow,
      },
    ];
  }, []);
}

function usePaletteFamilies(): { primitives: PaletteFamily[]; semantic: PaletteFamily[] } {
  return useMemo(() => {
    const primitives: PaletteFamily[] = [
      {
        id: "prim-purple",
        title: "Purple",
        vars: [
          "--color-purple-100",
          "--color-purple-200",
          "--color-purple-300",
          "--color-purple-400",
          "--color-purple-500",
          "--color-purple-600",
          "--color-purple-700",
          "--color-purple-800",
          "--color-purple-900",
        ],
      },
      {
        id: "prim-blue",
        title: "Blue",
        vars: [
          "--color-blue-100",
          "--color-blue-200",
          "--color-blue-300",
          "--color-blue-400",
          "--color-blue-500",
          "--color-blue-600",
          "--color-blue-700",
          "--color-blue-800",
          "--color-blue-900",
        ],
      },
      {
        id: "prim-gray",
        title: "Gray",
        vars: [
          "--color-gray-50",
          "--color-gray-100",
          "--color-gray-200",
          "--color-gray-300",
          "--color-gray-400",
          "--color-gray-500",
          "--color-gray-600",
          "--color-gray-700",
          "--color-gray-800",
          "--color-gray-900",
        ],
      },
      {
        id: "prim-chromatic",
        title: "Chromatic",
        vars: [
          "--color-chromatic-100",
          "--color-chromatic-200",
          "--color-chromatic-300",
          "--color-chromatic-400",
          "--color-chromatic-500",
          "--color-chromatic-600",
          "--color-chromatic-700",
          "--color-chromatic-800",
        ],
      },
      {
        id: "prim-green",
        title: "Green",
        vars: [
          "--color-green-100",
          "--color-green-200",
          "--color-green-300",
          "--color-green-400",
          "--color-green-500",
          "--color-green-600",
          "--color-green-700",
          "--color-green-800",
        ],
      },
      {
        id: "prim-orange",
        title: "Orange",
        vars: [
          "--color-orange-100",
          "--color-orange-200",
          "--color-orange-300",
          "--color-orange-400",
          "--color-orange-500",
          "--color-orange-600",
          "--color-orange-700",
          "--color-orange-800",
        ],
      },
      {
        id: "prim-red",
        title: "Red",
        vars: [
          "--color-red-100",
          "--color-red-200",
          "--color-red-300",
          "--color-red-400",
          "--color-red-500",
          "--color-red-600",
          "--color-red-700",
          "--color-red-800",
        ],
      },
      {
        id: "prim-white",
        title: "White (alpha)",
        vars: [
          "--color-white-0",
          "--color-white-100",
          "--color-white-200",
          "--color-white-300",
          "--color-white-400",
          "--color-white-500",
          "--color-white-600",
          "--color-white-700",
          "--color-white-800",
          "--color-white-1000",
        ],
      },
      {
        id: "prim-black",
        title: "Black (alpha)",
        vars: [
          "--color-black-0",
          "--color-black-100",
          "--color-black-200",
          "--color-black-300",
          "--color-black-400",
          "--color-black-500",
          "--color-black-600",
          "--color-black-700",
          "--color-black-800",
          "--color-black-1000",
        ],
      },
    ];

    const semantic: PaletteFamily[] = [
      {
        id: "sem-primary",
        title: "Primary",
        vars: [
          "--color-primary-100",
          "--color-primary-200",
          "--color-primary-300",
          "--color-primary-400",
          "--color-primary-500",
          "--color-primary-600",
          "--color-primary-700",
          "--color-primary-800",
        ],
      },
      {
        id: "sem-neutral",
        title: "Neutral",
        vars: [
          "--color-neutral-50",
          "--color-neutral-100",
          "--color-neutral-200",
          "--color-neutral-300",
          "--color-neutral-400",
          "--color-neutral-500",
          "--color-neutral-600",
          "--color-neutral-700",
          "--color-neutral-800",
          "--color-neutral-white",
          "--color-neutral-black",
        ],
      },
      {
        id: "sem-success",
        title: "Success",
        vars: [
          "--color-success-100",
          "--color-success-200",
          "--color-success-300",
          "--color-success-400",
          "--color-success-500",
          "--color-success-600",
          "--color-success-700",
          "--color-success-800",
        ],
      },
      {
        id: "sem-warning",
        title: "Warning",
        vars: [
          "--color-warning-100",
          "--color-warning-200",
          "--color-warning-300",
          "--color-warning-400",
          "--color-warning-500",
          "--color-warning-600",
          "--color-warning-700",
          "--color-warning-800",
        ],
      },
      {
        id: "sem-critical",
        title: "Critical",
        vars: [
          "--color-critical-100",
          "--color-critical-200",
          "--color-critical-300",
          "--color-critical-400",
          "--color-critical-500",
          "--color-critical-600",
          "--color-critical-700",
          "--color-critical-800",
        ],
      },
      {
        id: "sem-alpha-white",
        title: "Alpha Neutral White",
        vars: [
          "--color-alpha-neutral-white-0",
          "--color-alpha-neutral-white-100",
          "--color-alpha-neutral-white-200",
          "--color-alpha-neutral-white-300",
          "--color-alpha-neutral-white-400",
          "--color-alpha-neutral-white-500",
          "--color-alpha-neutral-white-600",
          "--color-alpha-neutral-white-700",
          "--color-alpha-neutral-white-800",
          "--color-alpha-neutral-white-1000",
        ],
      },
      {
        id: "sem-alpha-black",
        title: "Alpha Neutral Black",
        vars: [
          "--color-alpha-neutral-black-0",
          "--color-alpha-neutral-black-100",
          "--color-alpha-neutral-black-200",
          "--color-alpha-neutral-black-300",
          "--color-alpha-neutral-black-400",
          "--color-alpha-neutral-black-500",
          "--color-alpha-neutral-black-600",
          "--color-alpha-neutral-black-700",
          "--color-alpha-neutral-black-800",
          "--color-alpha-neutral-black-1000",
        ],
      },
    ];

    return { primitives, semantic };
  }, []);
}

function useComputedVarMap(refreshKey: string, vars: `--${string}`[]) {
  const [computed, setComputed] = useState<Record<string, string>>({});

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const v of vars) {
      next[v] = style.getPropertyValue(v).trim();
    }
    setComputed(next);
  }, [refreshKey, vars]);

  return computed;
}

function TokenPreview({
  token,
}: {
  token: TokenSpec;
}) {
  const preview = token.preview;
  const bg = preview?.backgroundVar ?? (token.kind === "bg" || token.kind === "util" || token.kind === "static" ? token.cssVar : "--bg-page-primary");
  const fg = preview?.foregroundVar ?? (token.kind === "fg" ? token.cssVar : "--fg-neutral");
  const border = preview?.borderVar ?? (token.kind === "border" ? token.cssVar : "--border-neutral-secondary");
  const overlayOn = preview?.overlayOnVar;

  return (
    <div
      className="ds-color-preview"
      style={{
        backgroundColor: overlayOn ? cssVarValue(overlayOn) : cssVarValue(bg),
        borderColor: cssVarValue(border),
      }}
    >
      {overlayOn ? (
        <div className="ds-color-preview__overlay" style={{ backgroundColor: cssVarValue(token.cssVar) }} />
      ) : null}
      <div className="ds-color-preview__content" style={{ color: cssVarValue(fg) }}>
        <div className="ds-color-preview__title">Aa</div>
        <div className="ds-color-preview__subtitle">Preview</div>
      </div>
    </div>
  );
}

function TokenTable({
  title,
  description,
  tokens,
  refreshKey,
  filter,
  computed,
}: {
  title: string;
  description?: string;
  tokens: TokenSpec[];
  refreshKey: string;
  filter: string;
  computed: Record<string, string>;
}) {
  const rows = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter((t) => `${t.cssVar} ${t.label} ${t.guidance ?? ""}`.toLowerCase().includes(q));
  }, [tokens, filter]);

  return (
    <div className="ds-color-table">
      <div className="ds-color-table__header">
        <div className="ds-color-table__title">{title}</div>
        {description ? <div className="ds-color-table__desc">{description}</div> : null}
      </div>

      <div className="ds-color-table__grid" role="table" aria-label={`${title} tokens`}>
        <div className="ds-color-table__row ds-color-table__row--head" role="row">
          <div className="ds-color-table__cell" role="columnheader">Token</div>
          <div className="ds-color-table__cell" role="columnheader">Role</div>
          <div className="ds-color-table__cell" role="columnheader">Preview</div>
          <div className="ds-color-table__cell" role="columnheader">Resolved</div>
          <div className="ds-color-table__cell" role="columnheader">Actions</div>
        </div>

        {rows.map((t) => {
          const raw = computed[t.cssVar]?.trim() ?? "";
          const resolved = resolveCssVarValue(t.cssVar, computed);
          const valueToShow = resolved || raw;

          return (
            <div key={t.cssVar} className="ds-color-table__row" role="row">
              <div className="ds-color-table__cell" role="cell">
                <div className="ds-color-token">
                  <code className="ds-color-token__code">{t.cssVar}</code>
                  <div className="ds-color-token__label">{t.label}</div>
                </div>
              </div>

              <div className="ds-color-table__cell" role="cell">
                <div className="ds-color-token__guidance">{t.guidance ?? ""}</div>
              </div>

              <div className="ds-color-table__cell" role="cell">
                <TokenPreview token={t} />
              </div>

              <div className="ds-color-table__cell" role="cell">
                <code className="ds-color-value">{valueToShow || "(unavailable)"}</code>
                <div className="ds-color-value__meta">{refreshKey}</div>
              </div>

              <div className="ds-color-table__cell ds-color-table__cell--actions" role="cell">
                <TokenCopyButton text={t.cssVar} label="var" />
                <TokenCopyButton text={colorToHex(valueToShow) || valueToShow} label="raw" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaletteGrid({
  title,
  description,
  families,
  computed,
  filter,
  onCopyValue,
}: {
  title: string;
  description?: string;
  families: PaletteFamily[];
  computed: Record<string, string>;
  filter: string;
  onCopyValue: (value: string, cssVar: string) => void;
}) {
  const q = filter.trim().toLowerCase();
  const filteredFamilies = useMemo(() => {
    if (!q) return families;
    return families
      .map((f) => ({
        ...f,
        vars: f.vars.filter((v) => `${f.title} ${v}`.toLowerCase().includes(q)),
      }))
      .filter((f) => f.vars.length > 0);
  }, [families, q]);

  const findPrimaryVar = (vars: `--${string}`[]): `--${string}` | null => {
    // Try to find -500 variant first, then fallback to middle value
    const fiveHundred = vars.find((v) => v.includes("-500"));
    if (fiveHundred) return fiveHundred;
    const middleIndex = Math.floor(vars.length / 2);
    return vars[middleIndex] || vars[0] || null;
  };

  return (
    <div className="ds-palette">
      <div className="ds-palette__header">
        <div className="ds-palette__title">{title}</div>
        {description ? <div className="ds-palette__desc">{description}</div> : null}
      </div>

      <div className="ds-palette__families">
        {filteredFamilies.map((family) => {
          const primaryVar = findPrimaryVar(family.vars);
          
          return (
            <PaletteFamilyCard
              key={family.id}
              family={family}
              primaryVar={primaryVar}
              computed={computed}
              onCopyValue={onCopyValue}
            />
          );
        })}
      </div>
    </div>
  );
}

function colorToHex(colorStr: string): string {
  if (!colorStr) return "";
  
  // If already hex, return it (preserve alpha if present)
  const hexMatch = colorStr.match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})/);
  if (hexMatch) return `#${hexMatch[1]}`;
  
  // Try to parse as rgba/rgb
  const color = parseColor(colorStr);
  if (color) {
    const r = color.r.toString(16).padStart(2, "0");
    const g = color.g.toString(16).padStart(2, "0");
    const b = color.b.toString(16).padStart(2, "0");
    // Include alpha if it's not fully opaque
    if (color.a < 1) {
      const a = Math.round(color.a * 255).toString(16).padStart(2, "0");
      return `#${r}${g}${b}${a}`;
    }
    return `#${r}${g}${b}`;
  }
  
  // Fallback: try to get computed color from DOM
  try {
    const tempEl = document.createElement("div");
    tempEl.style.color = colorStr;
    document.body.appendChild(tempEl);
    const computed = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    // Try to match rgba with alpha
    const rgbaMatch = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
    if (rgbaMatch) {
      const r = Number.parseInt(rgbaMatch[1]).toString(16).padStart(2, "0");
      const g = Number.parseInt(rgbaMatch[2]).toString(16).padStart(2, "0");
      const b = Number.parseInt(rgbaMatch[3]).toString(16).padStart(2, "0");
      // Include alpha if present and not fully opaque
      if (rgbaMatch[4] !== undefined) {
        const alpha = Number.parseFloat(rgbaMatch[4]);
        if (alpha < 1) {
          const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
          return `#${r}${g}${b}${a}`;
        }
      }
      return `#${r}${g}${b}`;
    }
  } catch {
    // Ignore errors
  }
  
  return colorStr;
}

function PaletteFamilyCard({
  family,
  primaryVar,
  computed,
  onCopyValue,
}: {
  family: PaletteFamily;
  primaryVar: `--${string}` | null;
  computed: Record<string, string>;
  onCopyValue: (value: string, cssVar: string) => void;
}) {
  const [previewVar, setPreviewVar] = useState<`--${string}` | null>(primaryVar);
  const currentPreview = previewVar || primaryVar;
  
  if (!currentPreview) return null;
  
  const resolved = resolveCssVarValue(currentPreview, computed);
  const display = resolved || computed[currentPreview] || "";
  const hexValue = colorToHex(display);

  return (
    <div className="ds-palette-family">
      <div className="ds-palette-family__header">
        <div className="ds-palette-family__title">{family.title}</div>
        {family.description ? <div className="ds-palette-family__desc">{family.description}</div> : null}
      </div>

      <div className="ds-palette-family__preview">
        <span 
          className="ds-palette-family__preview-chip" 
          style={{ backgroundColor: cssVarValue(currentPreview) }}
          onClick={() => onCopyValue(hexValue, currentPreview)}
          title="Click to copy hex value"
        />
        <span className="ds-palette-family__preview-value">{hexValue || "(unavailable)"}</span>
      </div>

      <div className="ds-palette-family__swatches">
        {family.vars.map((v) => {
          const resolved = resolveCssVarValue(v, computed);
          const display = resolved || computed[v] || "";
          const hexValue = colorToHex(display);
          const isActive = v === currentPreview;
          
          return (
            <button
              key={v}
              type="button"
              className={`ds-swatch-mini ${isActive ? "ds-swatch-mini--active" : ""}`}
              onClick={() => onCopyValue(hexValue, v)}
              onMouseEnter={() => setPreviewVar(v)}
              onMouseLeave={() => setPreviewVar(primaryVar)}
              title={`${v}: ${hexValue || display}`}
            >
              <span className="ds-swatch-mini__chip" style={{ backgroundColor: cssVarValue(v) }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContrastSection({
  computed,
  refreshKey,
}: {
  computed: Record<string, string>;
  refreshKey: string;
}) {
  const rows = useMemo(() => {
    const pairings: { id: string; label: string; bg: `--${string}`; fg: `--${string}`; guidance: string }[] = [
      {
        id: "on-action",
        label: "On-action text",
        bg: "--bg-primary",
        fg: "--fg-on-action",
        guidance: "Use for primary brand actions (buttons, strong emphasis).",
      },
      {
        id: "page-text",
        label: "Body text on page",
        bg: "--bg-page-primary",
        fg: "--fg-neutral",
        guidance: "Default reading text on primary page background.",
      },
      {
        id: "secondary-text",
        label: "Secondary text on page",
        bg: "--bg-page-primary",
        fg: "--fg-neutral-secondary",
        guidance: "Metadata/supporting text; verify AA for your font size.",
      },
      {
        id: "disabled",
        label: "Disabled content",
        bg: "--bg-disabled",
        fg: "--fg-on-disabled",
        guidance: "Disabled states should still be readable where required.",
      },
      {
        id: "success-tonal",
        label: "Success tonal",
        bg: "--bg-success-tonal",
        fg: "--fg-success-on-tonal",
        guidance: "Tonal success surfaces (banners, callouts).",
      },
      {
        id: "warning-tonal",
        label: "Warning tonal",
        bg: "--bg-warning-tonal",
        fg: "--fg-warning-on-tonal",
        guidance: "Tonal warning surfaces (banners, callouts).",
      },
      {
        id: "critical-tonal",
        label: "Critical tonal",
        bg: "--bg-critical-tonal",
        fg: "--fg-critical-on-tonal",
        guidance: "Tonal critical surfaces (banners, callouts).",
      },
    ];

    return pairings.map((p) => {
      const bgStr = resolveCssVarValue(p.bg, computed);
      const fgStr = resolveCssVarValue(p.fg, computed);
      const bgColor = parseColor(bgStr);
      const fgColor = parseColor(fgStr);
      const ratio = bgColor && fgColor ? contrastRatio(bgColor, fgColor) : null;
      const passAASmall = ratio !== null ? ratio >= 4.5 : null;
      const passAALarge = ratio !== null ? ratio >= 3.0 : null;
      return { ...p, bgStr, fgStr, ratio, passAASmall, passAALarge };
    });
  }, [computed, refreshKey]);

  return (
    <div className="ds-contrast">
      <div className="ds-contrast__note">
        Contrast is calculated using the WCAG relative luminance formula and evaluated against <strong>WCAG 2.1 Level AA</strong> standards. 
        <strong> 4.5:1</strong> applies to normal text (body text, labels, paragraphs). 
        <strong> 3:1</strong> applies to large text (≥18pt regular or ≥14pt bold).
      </div>

      <div className="ds-contrast__grid" role="table" aria-label="Contrast ratios (WCAG 2.1 Level AA)">
        <div className="ds-contrast__row ds-contrast__row--head" role="row">
          <div className="ds-contrast__cell" role="columnheader">Pairing</div>
          <div className="ds-contrast__cell" role="columnheader">Background</div>
          <div className="ds-contrast__cell" role="columnheader">Foreground</div>
          <div className="ds-contrast__cell" role="columnheader">Ratio</div>
          <div className="ds-contrast__cell" role="columnheader">AA (3:1)</div>
          <div className="ds-contrast__cell" role="columnheader">AA (4.5:1)</div>
        </div>

        {rows.map((r) => (
          <div key={r.id} className="ds-contrast__row" role="row">
            <div className="ds-contrast__cell" role="cell">
              <div className="ds-contrast__label">{r.label}</div>
              <div className="ds-contrast__guidance">{r.guidance}</div>
            </div>
            <div className="ds-contrast__cell" role="cell">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
                <span className="ds-contrast__chip" style={{ backgroundColor: cssVarValue(r.bg) }} />
                <code className="ds-contrast__code">{r.bg}</code>
                <TokenCopyButton text={r.bg} label="var" />
              </div>
              <div className="ds-contrast__value">{r.bgStr || "(unavailable)"}</div>
            </div>
            <div className="ds-contrast__cell" role="cell">
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-200)" }}>
                <span className="ds-contrast__chip" style={{ backgroundColor: cssVarValue(r.fg) }} />
                <code className="ds-contrast__code">{r.fg}</code>
                <TokenCopyButton text={r.fg} label="var" />
              </div>
              <div className="ds-contrast__value">{r.fgStr || "(unavailable)"}</div>
            </div>
            <div className="ds-contrast__cell" role="cell">
              <div className="ds-contrast__ratio">{r.ratio !== null ? r.ratio.toFixed(2) : "—"}</div>
            </div>
            <div className="ds-contrast__cell" role="cell">
              {r.passAALarge === null ? (
                <span className="ds-contrast__status">—</span>
              ) : r.passAALarge ? (
                <span className="ds-contrast__status ds-contrast__status--pass">Pass</span>
              ) : (
                <span className="ds-contrast__status ds-contrast__status--fail">Fail</span>
              )}
            </div>
            <div className="ds-contrast__cell" role="cell">
              {r.passAASmall === null ? (
                <span className="ds-contrast__status">—</span>
              ) : r.passAASmall ? (
                <span className="ds-contrast__status ds-contrast__status--pass">Pass</span>
              ) : (
                <span className="ds-contrast__status ds-contrast__status--fail">Fail</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ColorsPage() {
  const groups = useBrandTokenGroups();
  const { theme, hue, setTheme, setHue } = useTheme();
  const [filter, setFilter] = useState("");
  const refreshKey = `${theme}:${hue}`;
  const palette = usePaletteFamilies();

  const allVars = useMemo(() => {
    const vars = new Set<`--${string}`>();
    for (const g of groups) for (const t of g.tokens) vars.add(t.cssVar);
    for (const fam of [...palette.primitives, ...palette.semantic]) for (const v of fam.vars) vars.add(v);
    // Ensure contrast pairings are included even if not shown above
    [
      "--bg-primary",
      "--fg-on-action",
      "--bg-page-primary",
      "--fg-neutral",
      "--fg-neutral-secondary",
      "--bg-disabled",
      "--fg-on-disabled",
      "--bg-success-tonal",
      "--fg-success-on-tonal",
      "--bg-warning-tonal",
      "--fg-warning-on-tonal",
      "--bg-critical-tonal",
      "--fg-critical-on-tonal",
    ].forEach((v) => vars.add(v as `--${string}`));
    return Array.from(vars);
  }, [groups, palette]);

  const computed = useComputedVarMap(refreshKey, allVars);

  const tocItems: TocItem[] = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      { id: "general-concepts", label: "General concepts" },
      { id: "token-mapping", label: "Token mapping" },
      { id: "palette", label: "Palette" },
      { id: "brand", label: "Brand" },
      { id: "contrast", label: "Contrast ratio" },
      { id: "usage-guidance", label: "Usage guidance" },
    ];
  }, []);

  const handleCopyPaletteValue = async (value: string, cssVar: string) => {
    const text = value?.trim() ? value.trim() : cssVar;
    await copyToClipboard(text);
  };

  return (
    <PageLayout tocItems={tocItems} currentPath="/foundations/colors">
      <article className="ds-content">
        <header className="ds-content__header">
          <h3 className="ds-content__title">Color</h3>
          <p className="ds-content__subtitle">
            Color token values are defined by context. Toggle theme and hue to preview each context.
          </p>
        </header>

        <section id="overview" className="ds-content__section">
          <h6 className="ds-content__section-title">Overview</h6>
          <p className="ds-content__text">
            Beacon uses color tokens to keep UI consistent, themeable, and accessible. In product UI, prefer the <strong>brand role tokens</strong> (background/foreground/border)
            and treat the palette as reference.
          </p>
          <ul className="ds-content__bullet-list">
            <li>Use role tokens for implementation: <code>--bg-*</code>, <code>--fg-*</code>, <code>--border-*</code>.</li>
            <li>Avoid hard-coded hex values in components.</li>
            <li>Palette tokens (<code>--color-*</code>) are primarily for reference and token wiring.</li>
          </ul>
        </section>

        <section id="general-concepts" className="ds-content__section">
          <h6 className="ds-content__section-title">General concepts</h6>
          <p className="ds-content__text">
            Color themes and device color modes aren't synonymous. Themes are tailored to the product; modes are system-wide. Use theme-aware tokens so the UI remains readable and intentional.
          </p>
          <p className="ds-content__text">
            In Beacon, context comes from two switches:
          </p>
          <ul className="ds-content__bullet-list">
            <li><code>data-theme</code> (light/dark) overrides brand role tokens.</li>
            <li><code>data-hue</code> (chromatic/sky/indigo) changes the semantic primary palette that brand roles reference.</li>
          </ul>
        </section>

        <section id="token-mapping" className="ds-content__section">
          <h6 className="ds-content__section-title">Token mapping</h6>
          <p className="ds-content__text">
            Beacon uses a three-layer token system where each layer references the one below it. This creates a flexible, maintainable color system.
          </p>
          
          <div className="ds-token-mapping">
            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Primitives</h6>
              </div>
              <code className="ds-token-mapping__example">--color-purple-500</code>
              <p className="ds-token-mapping__desc">
                Raw color values defined in hex. These are the foundation colors that never change.
              </p>
            </div>

            <div className="ds-token-mapping__arrow">↓</div>

            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Semantic</h6>
              </div>
              <code className="ds-token-mapping__example">--color-primary-500</code>
              <p className="ds-token-mapping__desc">
                Context-aware colors that reference primitives. The primary color changes based on the selected hue (chromatic/sky/indigo).
              </p>
            </div>

            <div className="ds-token-mapping__arrow">↓</div>

            <div className="ds-token-mapping__layer">
              <div className="ds-token-mapping__header">
                <h6 className="ds-token-mapping__title">Brand</h6>
              </div>
              <code className="ds-token-mapping__example">--bg-primary</code>
              <p className="ds-token-mapping__desc">
                Product-facing role tokens that reference semantic tokens. These adapt to both theme (light/dark) and hue settings.
              </p>
            </div>
          </div>

          <div className="ds-token-mapping__example-box">
            <p className="ds-content__text">
              <strong>Example mapping:</strong> <code>--bg-primary</code> → <code>--color-primary-500</code> → <code>--color-purple-500</code> (when hue is "chromatic-prime")
            </p>
          </div>
        </section>

        <section className="ds-content__section" aria-label="Controls">
          <div className="ds-color-controls" role="group" aria-label="Theme, hue, and filter controls">
            <div className="ds-token-controls__group" aria-label="Theme">
              <span className="ds-token-controls__label">Theme</span>
              <div className="ds-token-controls__segmented" role="radiogroup" aria-label="Theme">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={theme === opt.value}
                    className={`ds-token-segment ${theme === opt.value ? "active" : ""}`}
                    onClick={() => setTheme(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ds-token-controls__group" aria-label="Hue">
              <span className="ds-token-controls__label">Hue</span>
              <div className="ds-token-controls__segmented" role="radiogroup" aria-label="Hue">
                {HUE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={hue === opt.value}
                    className={`ds-token-segment ${hue === opt.value ? "active" : ""}`}
                    onClick={() => setHue(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="ds-color-controls__group" aria-label="Filter">
              <label htmlFor="color-filter-input" className="ds-token-controls__label">Filter</label>
              <input
                id="color-filter-input"
                name="color-filter"
                className="ds-color-controls__input"
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search tokens (e.g. bg-primary, neutral, primary)…"
              />
            </div>

          </div>
        </section>

        <section id="palette" className="ds-content__section">
          <h6 className="ds-content__section-title">Palette</h6>
          <p className="ds-content__text">
            Palette tokens are reference values and semantic wiring. Use role tokens for product UI, and use this section to understand the underlying system.
          </p>

          <PaletteGrid
            title="Primitives"
            description="Raw color families (hex + alpha variants)."
            families={palette.primitives}
            computed={computed}
            filter={filter}
            onCopyValue={handleCopyPaletteValue}
          />

          <PaletteGrid
            title="Semantic"
            description="Semantic families (primary is hue-dependent)."
            families={palette.semantic}
            computed={computed}
            filter={filter}
            onCopyValue={handleCopyPaletteValue}
          />
        </section>

        <section id="brand" className="ds-content__section">
          <h6 className="ds-content__section-title">Brand</h6>
          <p className="ds-content__text">
            These are the product-facing color roles. Prefer these in components and avoid selecting raw palette values by appearance.
          </p>

          <div className="ds-color-section-stack">
            {groups.map((group) => (
              <TokenTable
                key={group.id}
                title={group.title}
                description={group.description}
                tokens={group.tokens}
                refreshKey={refreshKey}
                filter={filter}
                computed={computed}
              />
            ))}
          </div>
        </section>

        <section id="contrast" className="ds-content__section">
          <h6 className="ds-content__section-title">Contrast ratio</h6>
          <p className="ds-content__text">
            This section computes contrast in the current theme/hue context and evaluates against WCAG AA (small text).
          </p>
          <ContrastSection computed={computed} refreshKey={refreshKey} />
        </section>

        <section id="usage-guidance" className="ds-content__section">
          <h6 className="ds-content__section-title">Usage guidance</h6>
          <div className="ds-do-dont">
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Do</div>
              <ul className="ds-content__bullet-list">
                <li>Use role tokens for implementation (<code>--bg-*</code>, <code>--fg-*</code>, <code>--border-*</code>).</li>
                <li>Use paired "on" roles to preserve contrast (e.g. <code>--fg-on-action</code> on <code>--bg-primary</code>).</li>
                <li>Use state-specific roles (hover/pressed/focus/disabled) instead of manually adjusting colors.</li>
                <li>Verify contrast for text sizes and contexts.</li>
              </ul>
            </div>
            <div className="ds-do-dont__col">
              <div className="ds-do-dont__title">Don't</div>
              <ul className="ds-content__bullet-list">
                <li>Don't hardcode hex values in components.</li>
                <li>Don't pick palette tokens by appearance for UI roles.</li>
                <li>Don't rely on color alone to communicate meaning.</li>
                <li>Don't invent new colors outside the Figma token source.</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </PageLayout>
  );
}


