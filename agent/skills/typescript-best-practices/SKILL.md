---
name: typescript-best-practices
description: Enforces TypeScript type safety, API boundary contracts, and idiomatic usage. Activate when writing TypeScript, designing type contracts, reviewing TypeScript code, or when asked about TypeScript best practices.
---

## Role & Intent

When this skill is active, enforce strict type safety and idiomatic TypeScript. Treat `any` as a build error, default exports as a style violation, and unvalidated type widening as a boundary leak.

---

## Core Directives

### Type Safety

**MUST** use `unknown` instead of `any` for values whose shape is not known at compile time. Narrow with type guards before use.

**MUST NOT** use `any` as an escape hatch — if a type is genuinely unknown, say so with `unknown` and handle it.

```ts
// Incorrect (Avoid)
function parse(input: any): string {
  return input.trim();
}

// Correct (Idiomatic)
function parse(input: unknown): string {
  if (typeof input !== 'string') throw new TypeError('Expected string');
  return input.trim();
}
```

---

### Type vs Interface

**MUST** default to `type` for application code, domain entities, and data pipeline shapes.

**MUST** reach for `interface` only when authoring public-facing library contracts or OOP class hierarchies that consumers will `implement` or `extend`.

**MUST** compose types with intersections (`&`) rather than `interface extends` in application code.

```ts
// Incorrect (Avoid) — using interface extension in application code
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// Correct (Idiomatic) — type intersection for domain entities
type Animal = { name: string };
type Dog = Animal & { breed: string };
```

---

### Exports

**MUST** use named exports exclusively. One clear name per export, importable by any consumer without aliasing.

**MUST NOT** use `export default` — it breaks rename refactoring, produces ambiguous import names across teams, and cannot be re-exported cleanly.

**MUST NOT** use wildcard barrel exports (`export * from './module'`) — they cause tree-shaking failures and obscure the public surface.

```ts
// Incorrect (Avoid)
export default function createUser() { /* ... */ }
export * from './helpers';

// Correct (Idiomatic)
export function createUser() { /* ... */ }
export { formatDate, slugify } from './helpers';
```

---

### Utility Types & Const Assertions

**MUST** use `as const` for literal values that must not widen (config objects, tuple literals, enum-like maps).

**MUST** reach for stdlib utility types (`Omit`, `Pick`, `Partial`, `Readonly`, `Required`, `ReturnType`, `Parameters`) before defining new mapped types.

```ts
// Incorrect (Avoid)
const ROLES = { admin: 'admin', user: 'user' };
type Role = string;

type UserInput = {
  id?: string;
  name?: string;
  email?: string;
};

// Correct (Idiomatic)
const ROLES = { admin: 'admin', user: 'user' } as const;
type Role = (typeof ROLES)[keyof typeof ROLES];

type User = { id: string; name: string; email: string };
type UserInput = Partial<Pick<User, 'name' | 'email'>>;
```

---

## Verification Checklist

- [ ] No `any` in the diff — only `unknown` with explicit narrowing
- [ ] Application types use `type` + `&`; `interface` only for public library contracts / OOP hierarchies
- [ ] Zero `export default` — all exports are named
- [ ] No `export *` barrel re-exports — explicit named re-exports only
- [ ] Literal values that must not widen use `as const`
- [ ] Utility types (`Omit`, `Pick`, `Partial`, `Readonly`) used instead of hand-rolled mapped types where applicable
