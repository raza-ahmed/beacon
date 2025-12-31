/**
 * TypeScript API Analyzer
 * 
 * Extracts component props, types, and exports from beacon-ui package
 * using the TypeScript Compiler API.
 */

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import type { ComponentAPI, ComponentProp, ComponentType } from "./types";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PACKAGE_DIR = path.join(PROJECT_ROOT, "packages", "beacon-ui");
const PACKAGE_SRC = path.join(PACKAGE_DIR, "src");
const INDEX_FILE = path.join(PACKAGE_SRC, "index.ts");

// TypeScript compiler options
const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.Latest,
  module: ts.ModuleKind.ESNext,
  jsx: ts.JsxEmit.React,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  allowSyntheticDefaultImports: true,
  esModuleInterop: true,
  skipLibCheck: true,
};

/**
 * Get all component exports from index.ts
 */
export function getComponentExports(): Map<string, string> {
  const exports = new Map<string, string>();
  
  if (!fs.existsSync(INDEX_FILE)) {
    return exports;
  }

  const sourceFile = ts.createSourceFile(
    INDEX_FILE,
    fs.readFileSync(INDEX_FILE, "utf-8"),
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node) {
    if (ts.isExportDeclaration(node) && node.exportClause) {
      if (ts.isNamedExports(node.exportClause)) {
        for (const element of node.exportClause.elements) {
          const name = element.name?.text;
          if (name) {
            // Check if it's a component export (starts with uppercase)
            if (name[0] === name[0].toUpperCase() && name[0] !== name[0].toLowerCase()) {
              // Try to find the source file
              const moduleSpecifier = element.propertyName 
                ? undefined 
                : node.moduleSpecifier?.getText(sourceFile).replace(/['"]/g, "");
              
              if (moduleSpecifier) {
                const componentPath = path.resolve(
                  PACKAGE_SRC,
                  moduleSpecifier.replace(/^\.\//, "")
                );
                exports.set(name, componentPath);
              }
            }
          }
        }
      }
    }
    
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}

/**
 * Extract exported types from a source file
 */
function extractExportedTypes(sourceFile: ts.SourceFile): ComponentType[] {
  const types: ComponentType[] = [];

  function visit(node: ts.Node) {
    // Export type alias
    if (ts.isTypeAliasDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      const typeName = node.name.text;
      const typeDef = extractTypeDefinition(node.type, sourceFile);
      
      if (ts.isUnionTypeNode(node.type)) {
        const values: string[] = [];
        for (const type of node.type.types) {
          if (ts.isLiteralTypeNode(type) && ts.isStringLiteral(type.literal)) {
            values.push(type.literal.text);
          } else if (ts.isLiteralTypeNode(type) && ts.isNumericLiteral(type.literal)) {
            values.push(type.literal.text);
          }
        }
        types.push({
          name: typeName,
          type: "union",
          values,
          definition: typeDef,
        });
      } else {
        types.push({
          name: typeName,
          type: "type-alias",
          definition: typeDef,
        });
      }
    }

    // Export interface
    if (ts.isInterfaceDeclaration(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      const interfaceName = node.name.text;
      const properties: ComponentProp[] = [];

      for (const member of node.members) {
        if (ts.isPropertySignature(member)) {
          const propName = member.name && ts.isIdentifier(member.name) ? member.name.text : "";
          const optional = !!member.questionToken;
          const propType = extractTypeDefinition(member.type, sourceFile);
          
          properties.push({
            name: propName,
            type: propType,
            optional,
          });
        }
      }

      types.push({
        name: interfaceName,
        type: "interface",
        properties,
        definition: extractTypeDefinition(node, sourceFile),
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return types;
}

/**
 * Extract type definition as string
 */
function extractTypeDefinition(
  typeNode: ts.Node | undefined,
  sourceFile: ts.SourceFile
): string {
  if (!typeNode) return "unknown";
  
  const text = typeNode.getText(sourceFile);
  return text.trim();
}

/**
 * Extract component props interface
 */
function extractComponentProps(
  sourceFile: ts.SourceFile,
  componentName: string
): ComponentProp[] {
  const props: ComponentProp[] = [];
  const propsInterfaceName = `${componentName}Props`;

  function visit(node: ts.Node) {
    // Find the props interface
    if (
      ts.isInterfaceDeclaration(node) &&
      node.name.text === propsInterfaceName &&
      node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      for (const member of node.members) {
        if (ts.isPropertySignature(member)) {
          const propName = member.name && ts.isIdentifier(member.name) 
            ? member.name.text 
            : "";
          
          if (!propName) continue;

          const optional = !!member.questionToken;
          const propType = extractTypeDefinition(member.type, sourceFile);
          
          // Try to extract default value from component function
          const defaultValue = extractDefaultValue(sourceFile, propName);

          props.push({
            name: propName,
            type: propType,
            optional,
            defaultValue,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return props;
}

/**
 * Extract default value for a prop from component function
 */
function extractDefaultValue(
  sourceFile: ts.SourceFile,
  propName: string
): string | undefined {
  let defaultValue: string | undefined;

  function visit(node: ts.Node) {
    // Look for function declaration with destructured parameters
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
      const params = ts.isFunctionDeclaration(node) 
        ? node.parameters 
        : node.parameters;

      for (const param of params) {
        if (ts.isObjectBindingPattern(param.name)) {
          for (const element of param.name.elements) {
            if (
              ts.isBindingElement(element) &&
              element.name &&
              ts.isIdentifier(element.name) &&
              element.name.text === propName &&
              element.initializer
            ) {
              defaultValue = element.initializer.getText(sourceFile);
            }
          }
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return defaultValue;
}

/**
 * Get all exported types from index.ts
 */
export function getExportedTypes(): string[] {
  const types: string[] = [];

  if (!fs.existsSync(INDEX_FILE)) {
    return types;
  }

  const sourceFile = ts.createSourceFile(
    INDEX_FILE,
    fs.readFileSync(INDEX_FILE, "utf-8"),
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node) {
    if (ts.isExportDeclaration(node) && node.exportClause) {
      if (ts.isNamedExports(node.exportClause)) {
        for (const element of node.exportClause.elements) {
          const name = element.name?.text;
          if (name && name.includes("Props") || name.includes("Variant") || name.includes("Size") || name.includes("Status") || name.includes("State") || name.includes("Color") || name.includes("Type")) {
            types.push(name);
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
 * Analyze a component file and extract its API
 */
export function analyzeComponent(componentPath: string): ComponentAPI | null {
  if (!fs.existsSync(componentPath)) {
    return null;
  }

  const sourceCode = fs.readFileSync(componentPath, "utf-8");
  const sourceFile = ts.createSourceFile(
    componentPath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  // Extract component name from filename
  const componentName = path.basename(componentPath, ".tsx");
  const capitalizedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);

  // Extract props
  const props = extractComponentProps(sourceFile, capitalizedName);

  // Extract exported types
  const exportedTypes = extractExportedTypes(sourceFile);

  // Extract default props from component function
  const defaultProps: Record<string, string> = {};
  for (const prop of props) {
    if (prop.defaultValue) {
      defaultProps[prop.name] = prop.defaultValue;
    }
  }

  // Check exports from index.ts
  const allExports = getComponentExports();
  const isExported = allExports.has(capitalizedName);
  const exportedTypeNames = getExportedTypes();

  return {
    componentName: capitalizedName,
    props,
    exportedTypes,
    defaultProps,
    exports: {
      component: isExported,
      props: exportedTypeNames.includes(`${capitalizedName}Props`),
      types: exportedTypes.map(t => t.name).filter(name => 
        exportedTypeNames.includes(name)
      ),
    },
  };
}

/**
 * Analyze all components in the package
 */
export function analyzeAllComponents(): Map<string, ComponentAPI> {
  const components = new Map<string, ComponentAPI>();
  const componentsDir = path.join(PACKAGE_SRC, "components");

  if (!fs.existsSync(componentsDir)) {
    return components;
  }

  const files = fs.readdirSync(componentsDir);
  
  for (const file of files) {
    if (file.endsWith(".tsx") && !file.endsWith(".test.tsx") && !file.endsWith(".stories.tsx")) {
      const componentPath = path.join(componentsDir, file);
      const api = analyzeComponent(componentPath);
      
      if (api) {
        components.set(api.componentName, api);
      }
    }
  }

  return components;
}

/**
 * Get component file path from component name
 */
export function getComponentPath(componentName: string): string | null {
  const componentsDir = path.join(PACKAGE_SRC, "components");
  const fileName = `${componentName.charAt(0).toLowerCase() + componentName.slice(1)}.tsx`;
  const filePath = path.join(componentsDir, fileName);
  
  return fs.existsSync(filePath) ? filePath : null;
}

