/**
 * Shared types for documentation sync system
 */

export type SuggestionType =
  | "missing-prop"
  | "changed-type"
  | "missing-component"
  | "outdated-import"
  | "changed-default"
  | "removed-prop";

export interface DocSuggestion {
  component: string;
  type: SuggestionType;
  file: string;
  line?: number;
  message: string;
  suggestion: string;
  code?: string; // Suggested code fix
}

export interface ComponentProp {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
  description?: string;
}

export interface ComponentType {
  name: string;
  type: "union" | "interface" | "type-alias";
  values?: string[]; // For union types
  properties?: ComponentProp[]; // For interfaces
  definition?: string; // Full type definition
}

export interface ComponentAPI {
  componentName: string;
  props: ComponentProp[];
  exportedTypes: ComponentType[];
  defaultProps: Record<string, string>;
  exports: {
    component: boolean;
    props: boolean;
    types: string[];
  };
}

export interface DocumentationAPI {
  componentName: string;
  configInterface?: {
    name: string;
    props: ComponentProp[];
  };
  importedTypes: string[];
  codeExamples: string[];
  defaultConfig?: Record<string, string>;
}

export interface ComponentDiff {
  component: string;
  missingProps: ComponentProp[];
  removedProps: ComponentProp[];
  typeMismatches: {
    typeName: string;
    packageType: ComponentType;
    docType: ComponentType | undefined;
  }[];
  missingImports: string[];
  outdatedImports: string[];
  defaultValueChanges: {
    prop: string;
    packageDefault: string;
    docDefault: string;
  }[];
}

