/**
 * Documentation Sync Checker
 * 
 * Compares package component APIs with documentation pages
 * and generates suggestions for updates.
 */

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import {
  analyzeAllComponents,
  analyzeComponent,
  getComponentExports,
  getExportedTypes,
} from "./analyze-component-api";
import type {
  ComponentAPI,
  ComponentProp,
  ComponentType,
  ComponentDiff,
  DocSuggestion,
  DocumentationAPI,
} from "./types";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(PROJECT_ROOT, "src", "app", "components");
const COMPONENTS_DIR = path.join(PROJECT_ROOT, "src", "components");

/**
 * Extract config interface from documentation page
 */
function extractConfigInterface(sourceFile: ts.SourceFile): {
  name: string;
  props: ComponentProp[];
} | null {
  let configInterface: { name: string; props: ComponentProp[] } | null = null;

  function visit(node: ts.Node) {
    if (ts.isInterfaceDeclaration(node)) {
      const interfaceName = node.name.text;
      if (interfaceName.endsWith("Config")) {
        const props: ComponentProp[] = [];

        for (const member of node.members) {
          if (ts.isPropertySignature(member)) {
            const propName =
              member.name && ts.isIdentifier(member.name)
                ? member.name.text
                : "";
            if (!propName) continue;

            const optional = !!member.questionToken;
            const propType = extractTypeDefinition(member.type, sourceFile);

            props.push({
              name: propName,
              type: propType,
              optional,
            });
          }
        }

        configInterface = {
          name: interfaceName,
          props,
        };
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return configInterface;
}

/**
 * Extract type definition as string
 */
function extractTypeDefinition(
  typeNode: ts.Node | undefined,
  sourceFile: ts.SourceFile
): string {
  if (!typeNode) return "unknown";
  return typeNode.getText(sourceFile).trim();
}

/**
 * Extract imported types from documentation file
 */
function extractImportedTypes(sourceFile: ts.SourceFile): string[] {
  const types: string[] = [];

  function visit(node: ts.Node) {
    if (ts.isImportDeclaration(node)) {
      const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).replace(/['"]/g, "");
      
      if (moduleSpecifier === "beacon-ui" || moduleSpecifier.includes("beacon-ui")) {
        if (node.importClause?.namedBindings) {
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            for (const element of node.importClause.namedBindings.elements) {
              const name = element.name?.text;
              if (name && (name.includes("Props") || name.includes("Variant") || 
                  name.includes("Size") || name.includes("Status") || 
                  name.includes("State") || name.includes("Color") || 
                  name.includes("Type"))) {
                types.push(name);
              }
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return types;
}

/**
 * Extract default config from documentation page
 */
function extractDefaultConfig(sourceFile: ts.SourceFile): Record<string, string> {
  const defaults: Record<string, string> = {};

  function visit(node: ts.Node) {
    // Look for useState with initial config object
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && 
        node.expression.text === "useState") {
      if (node.arguments.length > 0 && ts.isObjectLiteralExpression(node.arguments[0])) {
        const obj = node.arguments[0];
        for (const prop of obj.properties) {
          if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
            const propName = prop.name.text;
            const value = prop.initializer.getText(sourceFile);
            defaults[propName] = value;
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return defaults;
}

/**
 * Analyze documentation page
 */
function analyzeDocumentation(docPath: string): DocumentationAPI | null {
  if (!fs.existsSync(docPath)) {
    return null;
  }

  const sourceCode = fs.readFileSync(docPath, "utf-8");
  const sourceFile = ts.createSourceFile(
    docPath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  // Extract component name from path
  const componentName = path.basename(path.dirname(docPath))
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

    const configInterface = extractConfigInterface(sourceFile);
    const importedTypes = extractImportedTypes(sourceFile);
    const defaultConfig = extractDefaultConfig(sourceFile);

  return {
    componentName,
    configInterface: configInterface || undefined,
    importedTypes,
    codeExamples: [],
    defaultConfig,
  };
}

/**
 * Compare component API with documentation
 */
function compareComponentAPI(
  packageAPI: ComponentAPI,
  docAPI: DocumentationAPI | null
): ComponentDiff {
  const diff: ComponentDiff = {
    component: packageAPI.componentName,
    missingProps: [],
    removedProps: [],
    typeMismatches: [],
    missingImports: [],
    outdatedImports: [],
    defaultValueChanges: [],
  };

  if (!docAPI) {
    // All props are missing if no documentation
    diff.missingProps = packageAPI.props;
    return diff;
  }

  // Compare props
  const docPropsMap = new Map(
    docAPI.configInterface?.props.map(p => [p.name, p]) || []
  );
  const packagePropsMap = new Map(
    packageAPI.props.map(p => [p.name, p])
  );

  // Find missing props
  for (const prop of packageAPI.props) {
    if (!docPropsMap.has(prop.name)) {
      diff.missingProps.push(prop);
    }
  }

  // Find removed props (in docs but not in package)
  for (const docProp of docAPI.configInterface?.props || []) {
    if (!packagePropsMap.has(docProp.name)) {
      diff.removedProps.push(docProp);
    }
  }

  // Compare types
  const exportedTypes = getExportedTypes();
  for (const packageType of packageAPI.exportedTypes) {
    // Check if type is imported in docs
    if (!docAPI.importedTypes.includes(packageType.name)) {
      if (exportedTypes.includes(packageType.name)) {
        diff.missingImports.push(packageType.name);
      }
    }
  }

  // Check for outdated imports (in docs but not exported)
  for (const importedType of docAPI.importedTypes) {
    if (!exportedTypes.includes(importedType)) {
      diff.outdatedImports.push(importedType);
    }
  }

  // Compare default values
  for (const prop of packageAPI.props) {
    if (prop.defaultValue && docAPI.defaultConfig) {
      const docDefault = docAPI.defaultConfig[prop.name];
      if (docDefault && docDefault !== prop.defaultValue) {
        diff.defaultValueChanges.push({
          prop: prop.name,
          packageDefault: prop.defaultValue,
          docDefault,
        });
      }
    }
  }

  return diff;
}

/**
 * Generate suggestions from diff
 */
function generateSuggestions(diff: ComponentDiff): DocSuggestion[] {
  const suggestions: DocSuggestion[] = [];
  const componentName = diff.component;
  const componentNameLower = componentName.charAt(0).toLowerCase() + componentName.slice(1);
  const docPagePath = path.join(
    DOCS_DIR,
    componentNameLower.replace(/([A-Z])/g, "-$1").toLowerCase(),
    "page.tsx"
  );

  // Missing props
  for (const prop of diff.missingProps) {
    suggestions.push({
      component: componentName,
      type: "missing-prop",
      file: docPagePath,
      message: `${componentName} component now supports '${prop.name}' prop but it's missing from documentation`,
      suggestion: `Add \`${prop.name}${prop.optional ? "?" : ""}: ${prop.type}\` to ${componentName}Config interface`,
      code: `  ${prop.name}${prop.optional ? "?" : ""}: ${prop.type};`,
    });
  }

  // Removed props
  for (const prop of diff.removedProps) {
    suggestions.push({
      component: componentName,
      type: "removed-prop",
      file: docPagePath,
      message: `Prop '${prop.name}' exists in documentation but was removed from ${componentName} component`,
      suggestion: `Remove \`${prop.name}\` from ${componentName}Config interface`,
    });
  }

  // Missing imports
  for (const typeName of diff.missingImports) {
    const previewPath = path.join(COMPONENTS_DIR, `${componentName}Preview.tsx`);
    suggestions.push({
      component: componentName,
      type: "outdated-import",
      file: previewPath,
      message: `Type '${typeName}' is exported from package but not imported in documentation`,
      suggestion: `Add \`${typeName}\` to imports from 'beacon-ui'`,
      code: `import { ${componentName}, type ${typeName} } from 'beacon-ui';`,
    });
  }

  // Outdated imports
  for (const typeName of diff.outdatedImports) {
    const previewPath = path.join(COMPONENTS_DIR, `${componentName}Preview.tsx`);
    suggestions.push({
      component: componentName,
      type: "outdated-import",
      file: previewPath,
      message: `Type '${typeName}' is imported but no longer exported from package`,
      suggestion: `Remove \`${typeName}\` from imports`,
    });
  }

  // Default value changes
  for (const change of diff.defaultValueChanges) {
    suggestions.push({
      component: componentName,
      type: "changed-default",
      file: docPagePath,
      message: `Default value for '${change.prop}' changed from ${change.docDefault} to ${change.packageDefault}`,
      suggestion: `Update default config value for '${change.prop}' to match component`,
      code: `  ${change.prop}: ${change.packageDefault},`,
    });
  }

  return suggestions;
}

/**
 * Check for missing component documentation
 */
function detectMissingComponents(): DocSuggestion[] {
  const suggestions: DocSuggestion[] = [];
  const exports = getComponentExports();
  const packageAPIs = analyzeAllComponents();

  // Only check actual component exports (not types)
  for (const [componentName, api] of packageAPIs) {
    if (!api.exports.component) {
      continue; // Skip if not exported as component
    }

    const componentNameLower = componentName.charAt(0).toLowerCase() + componentName.slice(1);
    const docPagePath = path.join(
      DOCS_DIR,
      componentNameLower.replace(/([A-Z])/g, "-$1").toLowerCase(),
      "page.tsx"
    );

    if (!fs.existsSync(docPagePath)) {
      suggestions.push({
        component: componentName,
        type: "missing-component",
        file: docPagePath,
        message: `Component '${componentName}' is exported from package but has no documentation page`,
        suggestion: `Create documentation page at ${docPagePath}`,
      });
    }
  }

  return suggestions;
}

/**
 * Main function to check documentation sync
 */
export function checkDocsSync(): DocSuggestion[] {
  const allSuggestions: DocSuggestion[] = [];

  // Check for missing components
  allSuggestions.push(...detectMissingComponents());

  // Analyze all components
  const packageAPIs = analyzeAllComponents();

  for (const [componentName, packageAPI] of packageAPIs) {
    if (!packageAPI.exports.component) {
      continue; // Skip if component is not exported
    }

    const componentNameLower = componentName.charAt(0).toLowerCase() + componentName.slice(1);
    const docPagePath = path.join(
      DOCS_DIR,
      componentNameLower.replace(/([A-Z])/g, "-$1").toLowerCase(),
      "page.tsx"
    );

    const docAPI = analyzeDocumentation(docPagePath);
    const diff = compareComponentAPI(packageAPI, docAPI);
    const suggestions = generateSuggestions(diff);

    allSuggestions.push(...suggestions);
  }

  return allSuggestions;
}

/**
 * Format suggestions for console output
 */
export function formatSuggestions(suggestions: DocSuggestion[]): string {
  if (suggestions.length === 0) {
    return "✓ Documentation is in sync with package";
  }

  const lines: string[] = [];
  lines.push(`\n⚠️  Documentation sync suggestions (${suggestions.length}):\n`);

  for (let i = 0; i < suggestions.length; i++) {
    const suggestion = suggestions[i];
    lines.push(`${i + 1}. ${suggestion.type.replace("-", " ").toUpperCase()}: ${suggestion.component}`);
    lines.push(`   File: ${suggestion.file}`);
    if (suggestion.line) {
      lines.push(`   Line: ${suggestion.line}`);
    }
    lines.push(`   Message: ${suggestion.message}`);
    lines.push(`   Suggestion: ${suggestion.suggestion}`);
    if (suggestion.code) {
      lines.push(`   Code: ${suggestion.code}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// CLI execution
if (require.main === module) {
  const suggestions = checkDocsSync();
  console.log(formatSuggestions(suggestions));
  
  if (suggestions.length > 0) {
    process.exit(1);
  }
}

