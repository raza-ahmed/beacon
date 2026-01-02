"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "beacon-ui";
import { CopyIcon, CheckIcon } from "beacon-icons";

interface TokenCopyButtonProps {
  text: string;
  label: "var" | "class" | "raw";
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

const LABEL_MAP: Record<"var" | "class" | "raw", string> = {
  var: "Var",
  class: "Class",
  raw: "Raw",
};

const ARIA_LABEL_MAP: Record<"var" | "class" | "raw", string> = {
  var: "Copy variable name",
  class: "Copy class name",
  raw: "Copy raw value",
};

export function TokenCopyButton({ text, label, ariaLabel, className, style }: TokenCopyButtonProps) {
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
    await copyToClipboard(text);
    setCopied(true);

    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout to revert after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const displayLabel = LABEL_MAP[label];
  const defaultAriaLabel = ariaLabel || ARIA_LABEL_MAP[label];

  return (
    <Button
      variant="outline"
      size="xs"
      color={copied ? "success" : "primary"}
      endIcon={copied ? <CheckIcon size="xs" /> : <CopyIcon size="xs" />}
      onClick={handleCopy}
      aria-label={defaultAriaLabel}
      className={className}
      style={style}
    >
      {displayLabel}
    </Button>
  );
}

