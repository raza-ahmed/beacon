# Command: Generate Documentation for a Design System Component (Living Document)

## Objective
Create or update a component documentation page in MDX or TSX. The documentation must always reflect the current state of the component but remain flexible for future additions, removals, and iterations.

## Work-in-Progress Policy
- Each component page is a **living document** that will evolve.
- Allow missing sections to be added later.
- Allow props, variants, and usage examples to expand as Figma evolves.
- Maintain backward compatibility where possible but adapt documentation when components or tokens change.

## Required Documentation Structure

### 1. Component Overview
- State the component name and its purpose.
- Clarify that the component and documentation may evolve.
- Explain how the component maps to Figma.

### 2. Figma Alignment
- List existing variants and states.
- Allow placeholders or “future variant” sections when new variants are expected.
- Maintain 1:1 naming correspondence with Figma.

### 3. Token Requirements
- List all tokens currently used.
- Figma exported tokens is added inside Design Token Figma folder in the project.
- Permit expansion as token definitions evolve.
- Avoid raw values.

### 4. API Reference (TypeScript)
- Document all current props and types.
- Allow new props to be added later.
- Keep all types explicit.
- Document deprecated props as the system evolves.

### 5. Usage Examples (Copyable)
Provide TSX examples for:
- Default usage
- Variants (current and any future additions as they become available)
- States (hover, active, disabled)
- Token-driven styles

Rules for examples:
- Must be valid TypeScript.
- Must use named exports.
- Must reference tokens, not raw values.

### 6. Designer Guidelines
- Describe usage intentions.
- Explain variant meanings.
- Treat guidelines as expandable; allow new cases to be added over time.

### 7. Developer Guidelines
- Explain integration patterns.
- Provide accessibility expectations.
- Allow future implementation notes to be appended.

### 8. Accessibility Considerations
Document:
- ARIA usage
- Interaction model
- Token-based contrast requirements

This section must remain open to future updates based on accessibility changes.

### 9. Related Components
- List current relationships.
- Allow new relationships to be appended as the system evolves.

### 10. Versioning Notes
- Track the component’s evolution.
- Document deprecated, updated, or experimental props.
- Record migration paths when structural changes occur.

## Expected Output
A structured, update-friendly component documentation page that tracks the evolving state of the design system while maintaining strict compliance with tokens, Figma definitions, and TypeScript rules.