/**
 * Validates that all CSS variable references in the codebase match actual token definitions
 * Run with: npx tsx scripts/validate-css-vars.ts
 */

import * as fs from "fs";
import * as path from "path";

// Read all valid CSS variables from generated token files
function getValidCssVars(): Set<string> {
  const validVars = new Set<string>();
  
  // Read all generated CSS files
  const tokenFiles = [
    "index.css",
    "primitives.css",
    "semantic.css",
    "typography.css",
    "effects.css",
    "responsive.css",
    "brand-light.css",
    "brand-dark.css",
  ];
  
  const tokensDir = path.join(__dirname, "../packages/beacon-ui/tokens/generated");
  
  for (const file of tokenFiles) {
    const filePath = path.join(tokensDir, file);
    if (!fs.existsSync(filePath)) continue;
    
    const css = fs.readFileSync(filePath, "utf-8");
    
    // Extract all CSS variable definitions (--var-name:)
    const varRegex = /--([a-z0-9-]+):/g;
    let match;
    while ((match = varRegex.exec(css)) !== null) {
      validVars.add(`--${match[1]}`);
    }
  }
  
  return validVars;
}

// Find all CSS variable references in code
function findCssVarReferences(filePath: string): Array<{ line: number; var: string; context: string }> {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const references: Array<{ line: number; var: string; context: string }> = [];
  
  // Match var(--variable-name) but ignore comments
  const varRegex = /var\((--[a-z0-9-]+)\)/g;
  
  lines.forEach((line, index) => {
    // Skip comment lines
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("//") || trimmedLine.startsWith("/*") || trimmedLine.startsWith("*")) {
      return;
    }
    
    // Skip if the var() is inside a comment
    const commentIndex = line.indexOf("//");
    const commentIndex2 = line.indexOf("/*");
    const hasComment = commentIndex !== -1 || commentIndex2 !== -1;
    
    let match;
    while ((match = varRegex.exec(line)) !== null) {
      // Check if match is before comment
      if (hasComment) {
        const matchIndex = match.index;
        if (commentIndex !== -1 && matchIndex > commentIndex) continue;
        if (commentIndex2 !== -1 && matchIndex > commentIndex2) continue;
      }
      
      references.push({
        line: index + 1,
        var: match[1],
        context: line.trim().substring(0, 100),
      });
    }
  });
  
  return references;
}

// Recursively find all TypeScript/TSX files
function findTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip ignored directories
      if (
        file === "node_modules" ||
        file === "dist" ||
        file === ".next" ||
        file === "tokens" ||
        file.startsWith(".")
      ) {
        return;
      }
      findTsFiles(filePath, fileList);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      // Skip generated files
      if (filePath.includes("tokens/generated")) {
        return;
      }
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main validation
function validateCssVars() {
  console.log("Validating CSS variable references...\n");
  
  const validVars = getValidCssVars();
  console.log(`Found ${validVars.size} valid CSS variables in token files\n`);
  
  // Find all TypeScript/TSX files
  const rootDir = path.join(__dirname, "..");
  const files = findTsFiles(rootDir);
  
  const errors: Array<{ file: string; line: number; var: string; context: string }> = [];
  
  for (const filePath of files) {
    const references = findCssVarReferences(filePath);
    const relativePath = path.relative(rootDir, filePath);
    
    for (const ref of references) {
      if (!validVars.has(ref.var)) {
        errors.push({
          file: relativePath,
          line: ref.line,
          var: ref.var,
          context: ref.context,
        });
      }
    }
  }
  
  if (errors.length > 0) {
    console.error(`❌ Found ${errors.length} invalid CSS variable reference(s):\n`);
    errors.forEach((error) => {
      console.error(`  ${error.file}:${error.line}`);
      console.error(`    Variable: ${error.var}`);
      console.error(`    Context: ${error.context}\n`);
    });
    process.exit(1);
  } else {
    console.log("✅ All CSS variable references are valid!");
    process.exit(0);
  }
}

try {
  validateCssVars();
} catch (error) {
  console.error("Error validating CSS variables:", error);
  process.exit(1);
}

