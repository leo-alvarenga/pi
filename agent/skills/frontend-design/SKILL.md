---
name: frontend-design
description: Guides UI/UX implementation, component styling, layout composition, and design systems. Use when building UI components, landing pages, dashboards, or styling with Tailwind/CSS.
---

# Frontend Design & UI/UX Guidelines

When designing or implementing user interfaces, adhere to these principles:

## 1. Avoid "AI Generic" Aesthetics

- Do not default to centered purple gradients, generic Inter typography, or floaty low-contrast glassmorphism unless explicitly requested.
- Use intentional, opinionated typography pairings (e.g., modern grotesque sans for headings, monospace accents for data/labels).
- Establish a strict 8pt/4pt spatial grid (`gap-2`, `gap-4`, `p-6`).

## 2. Component Composition & States

- Every interactive element MUST implement 4 visual states: `default`, `hover`, `active/focus-visible`, and `disabled`.
- Ensure focus rings use high-contrast outline offsets (`focus-visible:ring-2 focus-visible:ring-offset-2`).
- Build components atomically with clear prop contracts (variants via `cva` or standard Tailwind classes).

## 3. Responsive & Layout Rules

- Mobile-first approach: never hardcode fixed pixel widths on layout containers (`w-full max-w-7xl mx-auto`).
- Guard against content overflow: truncate long dynamic strings (`truncate` or `line-clamp-2`) and set flexible image containers.
