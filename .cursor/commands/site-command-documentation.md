# Command: Build the Design System Documentation Site

## Objective
Generate and maintain a TypeScript-based design system documentation site that evolves continuously. The site must support incremental updates, additions, and revisions as the design system matures.

## Work-in-Progress Policy
- Treat the documentation site as a **living, continuously updated system**.
- All pages, structures, and sections must allow additions, removals, and iterative revisions.
- Avoid assumptions of completeness; the system must support partial coverage and future expansion.
- Newly added tokens, components, or guidelines must be incorporated without breaking existing pages.

## Architecture Requirements
- Use React with TypeScript.
- Use a framework supporting incremental content generation (such as Next.js or MDX-based static generation).
- All style values must reference token modules; do not generate raw values.
- Ensure that tokens, components, and docs remain decoupled to allow independent evolution.

## Source-of-Truth Compliance
- Figma tokens and component definitions are authoritative.
- Figma exported tokens is added inside Design Token Figma folder in the project.
- Updates in Figma may require corresponding updates in documentation and component code.
- Do not generate tokens, components, or guidelines that do not exist in Figma unless explicitly approved.

## Documentation Structure
The site must contain these evolving sections:

### 1. Introduction
- Brief overview of the design system’s purpose.

### 2. Tokens
- Token pages must reflect the current token set.
- Support dynamic updates as token values or naming evolve.
- Display token names, descriptions, usages, and TypeScript import examples.

### 3. Components
- The component index must automatically list new components as they are added.
- Each component entry must link to its documentation page.
- The index must tolerate missing components while the system is under construction.

### 4. Guidelines
- Layout, spacing, accessibility, and usage guidelines must be modular.
- Allow sections to appear, expand, or be replaced over time.

### 5. Example Sandbox
- Render components dynamically.
- Allow variant expansion as new variants are added in Figma.
- All examples must be copyable TSX snippets.

## Output Specifications
- Use MDX or TSX for content pages.
- All examples must be strictly typed.
- Use named exports.
- Maintain token references in all samples.

## Consistency Rules
- Avoid inferring missing variants; only document what exists but allow future variants to be added.