---
name: react-perf-architect
description: Audits and optimizes React/TypeScript component state, re-renders, and data-flow patterns. Use when writing complex state logic, custom hooks, or refactoring React components.
---

# React State & Performance Architecture

Apply these rules when architecting React component logic and state:

## 1. State Colocation & Hierarchy

- Keep state as close to where it is consumed as possible. Do not lift state to global context if only a child tree needs it.
- Derive state during render instead of syncing it via `useEffect`.

## 2. Anti-Patterns to Eliminate

- **Never mirror props in state** unless intentionally creating editable draft state.
- **Do not use `useEffect` for data transformations.** Compute values inline or wrap expensive calculations in `useMemo`.
- **Avoid object/array allocations inside JSX props** in heavily rendered lists (e.g., avoid `style={{ margin: 0 }}` or inline arrow handlers in virtualized rows).

## 3. Form & Server-State Handling

- Treat server cache (TanStack Query / SWR / Server Actions) as separate from local UI state.
- Validate dynamic payloads at the boundary using strict schemas (e.g., Zod).
