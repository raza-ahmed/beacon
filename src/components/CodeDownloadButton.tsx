"use client";

import { ButtonIcon } from "beacon-ui";
import { DownloadIcon } from "beacon-icons";

interface CodeDownloadButtonProps {
  code: string;
  filename?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export function CodeDownloadButton({
  code,
  filename = "ai-coding-instructions.md",
  ariaLabel = "Download file",
  style,
}: CodeDownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        color="primary"
        icon={<DownloadIcon size="xs" />}
        onClick={handleDownload}
        aria-label={ariaLabel}
      />
    </div>
  );
}
