/**
 * Prepare Icons Script
 * 
 * Automatically converts SVG files from the icons/ directory into React components
 * and updates the design system's icon packages and documentation.
 */

import * as fs from "fs";
import * as path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const ICONS_SOURCE_DIR = path.join(PROJECT_ROOT, "icons");
const BEACON_ICONS_FILE = path.join(PROJECT_ROOT, "packages", "beacon-icons", "src", "index.tsx");
const LOCAL_ICONS_FILE = path.join(PROJECT_ROOT, "src", "components", "icons", "index.tsx");
const ICONS_DOC_PAGE = path.join(PROJECT_ROOT, "src", "app", "foundations", "icons", "page.tsx");

/**
 * Sanitizes a filename into a PascalCase component name ending with "Icon"
 */
function sanitizeComponentName(filename: string): string {
  const name = path.parse(filename).name;
  
  // Replace non-alphanumeric with spaces, then split
  const parts = name.replace(/[^a-zA-Z0-9]/g, " ").split(/\s+/);
  
  // Filter out "Icon" or "Icons" (case-insensitive) from parts
  const filteredParts = parts.filter(part => {
    const lower = part.toLowerCase();
    return lower !== "icon" && lower !== "icons" && part.length > 0;
  });

  // PascalCase
  const pascalName = filteredParts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
    
  // Ensure it ends with Icon
  return `${pascalName}Icon`;
}

/**
 * Extracts paths and other shapes from SVG content and adapts them for the icon component
 */
function extractSvgContent(svgContent: string): string {
  // Extract content between <svg> tags
  const svgInnerMatch = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  if (!svgInnerMatch) return "";
  
  let content = svgInnerMatch[1];
  
  // Clean up content
  content = content
    // Replace fill and stroke with our color logic
    // We want to handle both fill="..." and stroke="..."
    // If it has fill or stroke, we replace it with {getIconFillColor(color)}
    // Note: this is a simple regex and might need refinement for complex SVGs
    .replace(/fill="[^"]*"/g, 'fill={getIconFillColor(color)}')
    .replace(/stroke="[^"]*"/g, 'stroke={getIconFillColor(color)}')
    // Convert kebab-case attributes to camelCase for React
    .replace(/fill-rule/g, 'fillRule')
    .replace(/clip-rule/g, 'clipRule')
    .replace(/stroke-width/g, 'strokeWidth')
    .replace(/stroke-linecap/g, 'strokeLinecap')
    .replace(/stroke-linejoin/g, 'strokeLinejoin');
    
  return content.trim();
}

/**
 * Creates the React component code for an icon
 */
function createIconComponent(componentName: string, innerContent: string): string {
  return `
export function ${componentName}({ size = "xs", className, color }: IconProps) {
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
      ${innerContent}
    </svg>
  );
}
`;
}

/**
 * Updates a file by appending new components
 */
function updateIconFile(filePath: string, newComponents: string): void {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, "utf-8");
  // Append before the end of file (assuming the file is just a list of exports)
  fs.writeFileSync(filePath, content.trim() + "\n" + newComponents + "\n", "utf-8");
  console.log(`✓ Updated ${filePath}`);
}

/**
 * Updates the documentation gallery page
 */
function updateDocPage(newIcons: { name: string }[]): void {
  if (!fs.existsSync(ICONS_DOC_PAGE)) {
    console.error(`Doc page not found: ${ICONS_DOC_PAGE}`);
    return;
  }
  
  let content = fs.readFileSync(ICONS_DOC_PAGE, "utf-8");
  
  // 1. Update imports
  const importMatch = content.match(/} from "beacon-icons";/);
  if (importMatch) {
    const importList = newIcons.map(icon => `  ${icon.name},`).join("\n");
    content = content.replace(/} from "beacon-icons";/, `${importList}\n} from "beacon-icons";`);
  }
  
  // 2. Update ALL_ICONS array
  const arrayMatch = content.match(/const ALL_ICONS: IconItem\[\] = \[([\s\S]*?)\];/);
  if (arrayMatch) {
    const arrayItems = newIcons.map(icon => `  { name: "${icon.name}", component: ${icon.name} },`).join("\n");
    content = content.replace(/const ALL_ICONS: IconItem\[\] = \[/, `const ALL_ICONS: IconItem[] = [\n${arrayItems}`);
  }
  
  fs.writeFileSync(ICONS_DOC_PAGE, content, "utf-8");
  console.log(`✓ Updated ${ICONS_DOC_PAGE}`);
}

// Main execution
try {
  if (!fs.existsSync(ICONS_SOURCE_DIR)) {
    console.error(`Source directory not found: ${ICONS_SOURCE_DIR}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(ICONS_SOURCE_DIR).filter(file => file.endsWith(".svg"));
  
  if (files.length === 0) {
    console.log("No SVG files found in icons/ directory.");
    process.exit(0);
  }
  
  console.log(`Processing ${files.length} icons...\n`);
  
  const processedIcons: { name: string; code: string }[] = [];
  
  for (const file of files) {
    const filePath = path.join(ICONS_SOURCE_DIR, file);
    const svgContent = fs.readFileSync(filePath, "utf-8");
    const componentName = sanitizeComponentName(file);
    const innerContent = extractSvgContent(svgContent);
    
    if (innerContent) {
      const code = createIconComponent(componentName, innerContent);
      processedIcons.push({ name: componentName, code });
      console.log(`  - Prepared ${componentName} from ${file}`);
    } else {
      console.warn(`  - Skipping ${file}: Could not extract SVG content.`);
    }
  }
  
  if (processedIcons.length > 0) {
    const combinedCode = processedIcons.map(icon => icon.code).join("\n");
    
    updateIconFile(BEACON_ICONS_FILE, combinedCode);
    updateIconFile(LOCAL_ICONS_FILE, combinedCode);
    updateDocPage(processedIcons);
    
    // Move processed files to a 'processed' folder or delete? 
    // For now, just leave them or the user might want to keep them.
    // The instructions say "if I add the svg", implying a one-time process for each add.
    
    console.log(`\n✓ Successfully processed ${processedIcons.length} icons!`);
    console.log(`\nNext steps:`);
    console.log(`1. Run 'npm run build:icons' to build the icon package.`);
    console.log(`2. Run 'npm run dev' to see the new icons in the documentation site.`);
  }
  
} catch (error) {
  console.error("Error preparing icons:", error);
  process.exit(1);
}
