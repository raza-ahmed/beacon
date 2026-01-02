"use client";

import { useState, useEffect, useRef } from "react";
import { ButtonIcon } from "beacon-ui";
import { CopyIcon, CheckIcon } from "beacon-icons";

interface CodeCopyButtonProps {
  code: string;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers
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

export function CodeCopyButton({ code, ariaLabel = "Copy code", className, style }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);

    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to revert after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  // Default positioning styles (can be overridden via style prop)
  const defaultStyle: React.CSSProperties = {
    position: "absolute",
    top: "var(--spacing-200)",
    right: "var(--spacing-200)",
    zIndex: 10,
  };

  const mergedStyle = style ? { ...defaultStyle, ...style } : defaultStyle;

  return (
    <div style={mergedStyle}>
      <ButtonIcon
        variant="tonal"
        size="sm"
        color={copied ? "success" : "primary"}
        icon={copied ? <CheckIcon size="xs" /> : <CopyIcon size="xs" />}
        onClick={handleCopy}
        aria-label={ariaLabel}
        className={className}
      />
    </div>
  );
}

