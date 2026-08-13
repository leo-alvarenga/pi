---
name: a11y-web-standards
description: Enforces WCAG 2.2 accessibility, semantic HTML, ARIA attributes, and keyboard navigation. Use when asked for accessibility/a11y tips and help when building modals, dropdowns, forms, and other UI components.
---

# Web Accessibility (A11y) Rules

## 1. Semantic Elements First

- Use `<button>` for actions and `<a href="...">` for navigation. Never place `onClick` on a `<div>` or `<span>` without explicit keyboard listeners and ARIA roles.
- Form inputs must always have an associated `<label htmlFor="...">` or `aria-label`.

## 2. Modals, Drawers & Menus

- Trap focus inside active dialogs (`Tab` cycles through modal elements only).
- Close open dialogs/overlays on `Escape`.
- Return focus to the trigger element when the dialog closes.
- Ensure all icon-only buttons include `aria-label="Action Description"` and decorative icons use `aria-hidden="true"`.
