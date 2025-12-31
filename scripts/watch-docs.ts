/**
 * File Watcher for Documentation Sync
 * 
 * Monitors changes in packages/beacon-ui and automatically
 * checks if documentation needs updates.
 */

import * as path from "path";
import { checkDocsSync, formatSuggestions } from "./check-docs-sync";

// Use chokidar if available, otherwise fall back to basic fs.watch
let chokidar: typeof import("chokidar") | null = null;
try {
  chokidar = require("chokidar");
} catch {
  // chokidar not installed, will use fs.watch
}

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PACKAGE_SRC = path.join(PROJECT_ROOT, "packages", "beacon-ui", "src");

// Debounce timer
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 500;

// Track changed files
const changedFiles = new Set<string>();

/**
 * Handle file change
 */
function handleFileChange(filePath: string) {
  changedFiles.add(filePath);

  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set new timer
  debounceTimer = setTimeout(() => {
    processChanges();
  }, DEBOUNCE_MS);
}

/**
 * Process all changes
 */
function processChanges() {
  if (changedFiles.size === 0) return;

  const files = Array.from(changedFiles);
  changedFiles.clear();

  console.log("\n📦 Package changes detected:");
  for (const file of files) {
    const relativePath = path.relative(PROJECT_ROOT, file);
    console.log(`   - ${relativePath}`);
  }

  console.log("\n🔍 Checking documentation sync...\n");

  try {
    const suggestions = checkDocsSync();
    const output = formatSuggestions(suggestions);
    console.log(output);

    if (suggestions.length > 0) {
      console.log("\n💡 Tip: Review the suggestions above and update documentation as needed.");
    }
  } catch (error) {
    console.error("❌ Error checking documentation sync:", error);
  }

  console.log("\n👀 Watching for changes... (Press Ctrl+C to exit)\n");
}

/**
 * Start watching with chokidar
 */
function startChokidarWatcher() {
  if (!chokidar) {
    throw new Error("chokidar is not installed. Run: npm install chokidar");
  }

  const watcher = chokidar.watch(
    [
      path.join(PACKAGE_SRC, "**/*.tsx"),
      path.join(PACKAGE_SRC, "**/*.ts"),
      path.join(PACKAGE_SRC, "index.ts"),
    ],
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
    }
  );

  watcher
    .on("change", (filePath) => {
      handleFileChange(filePath);
    })
    .on("add", (filePath) => {
      handleFileChange(filePath);
    })
    .on("unlink", (filePath) => {
      handleFileChange(filePath);
    })
    .on("error", (error) => {
      console.error("❌ Watcher error:", error);
    });

  return watcher;
}

/**
 * Start watching with fs.watch (fallback)
 */
function startFsWatcher() {
  const fs = require("fs");

  function watchDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      return;
    }

    fs.watch(dir, { recursive: true }, (eventType: string, filename: string) => {
      if (!filename) return;

      const filePath = path.join(dir, filename);
      
      // Only watch .tsx and .ts files
      if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) {
        return;
      }

      // Only watch src directory
      if (!filePath.includes(PACKAGE_SRC)) {
        return;
      }

      handleFileChange(filePath);
    });

    // Recursively watch subdirectories
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          watchDirectory(path.join(dir, entry.name));
        }
      }
    } catch (error) {
      // Ignore errors
    }
  }

  watchDirectory(PACKAGE_SRC);
}

/**
 * Main function
 */
function main() {
  console.log("🚀 Starting documentation sync watcher...\n");
  console.log(`📁 Watching: ${path.relative(PROJECT_ROOT, PACKAGE_SRC)}\n`);

  // Run initial check
  console.log("🔍 Running initial documentation check...\n");
  try {
    const suggestions = checkDocsSync();
    const output = formatSuggestions(suggestions);
    console.log(output);
  } catch (error) {
    console.error("❌ Error during initial check:", error);
  }

  console.log("\n👀 Watching for changes... (Press Ctrl+C to exit)\n");

  // Start watcher
  let watcher: any = null;

  if (chokidar) {
    watcher = startChokidarWatcher();
  } else {
    console.warn("⚠️  chokidar not installed, using fs.watch (less reliable)");
    console.warn("   Install chokidar for better performance: npm install chokidar\n");
    startFsWatcher();
  }

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n\n👋 Stopping watcher...");
    if (watcher && typeof watcher.close === "function") {
      watcher.close();
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n\n👋 Stopping watcher...");
    if (watcher && typeof watcher.close === "function") {
      watcher.close();
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    process.exit(0);
  });
}

// Run if executed directly
if (require.main === module) {
  main();
}

