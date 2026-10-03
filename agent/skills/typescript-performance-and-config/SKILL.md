---
name: typescript-performance-and-config
description: Enforces tsconfig.json correctness, compiler performance, and module resolution best practices. Activate when configuring TypeScript projects, optimizing tsconfig, reviewing module resolution, or when tsc type checking is slow.
---

## Role & Intent

When this skill is active, treat a weak `tsconfig.json` as a runtime bug waiting to happen. Enforce strict compiler flags, modern module resolution, and type-level patterns that keep `tsc` fast.

---

## Core Directives

### Strict tsconfig.json Baseline

**MUST** enable the following flags. Omitting any one of them creates a class of bugs that TypeScript cannot catch:

| Flag | Why it matters |
|---|---|
| `"strict": true` | Enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictPropertyInitialization`, and more in one flag |
| `"noImplicitAny": true` | Redundant under `strict`, but explicit — prevents silent `any` widening |
| `"strictNullChecks": true` | Makes `null` and `undefined` non-assignable to other types without explicit union |
| `"exactOptionalPropertyTypes": true` | Distinguishes `{ key?: string }` (absent) from `{ key: string \| undefined }` (present-but-undefined) |
| `"noUncheckedIndexedAccess": true` | Index signatures return `T \| undefined`, forcing null checks on array/object access |
| `"noImplicitOverride": true` | Forces explicit `override` keyword on subclass methods |

```jsonc
// Incorrect (Avoid) — permissive config
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs"
  }
}

// Correct (Idiomatic) — strict baseline
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

### Module Resolution

**MUST** use `"moduleResolution": "NodeNext"` for Node.js projects (requires `"module": "NodeNext"`) or `"moduleResolution": "Bundler"` for bundler-driven projects (Vite, webpack, esbuild).

**MUST NOT** use `"moduleResolution": "node"` (legacy) — it misresolves ESM packages and does not enforce file extension requirements.

**MUST** include explicit file extensions in relative imports when using `NodeNext` resolution (`import { foo } from './foo.js'`, not `'./foo'`).

```ts
// Incorrect (Avoid) — missing extension under NodeNext
import { createUser } from './createUser';

// Correct (Idiomatic)
import { createUser } from './createUser.js';
```

---

### Avoid Slow Conditional Types

**MUST NOT** write deeply nested or recursive conditional types. They force `tsc` to evaluate an exponential number of branches and can make type checking orders of magnitude slower.

**MUST NOT** use `infer` chains longer than 2–3 levels. If you need more, the abstraction is likely wrong.

**SHOULD** prefer mapped types and utility types over recursive conditional types for structural transformations.

```ts
// Incorrect (Avoid) — deeply nested conditional slows tsc
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: T[K] extends object
      ? T[K] extends Array<infer U>
        ? Array<DeepPartial<U>>
        : DeepPartial<T[K]>
      : T[K] }
  : T;

// Correct (Idiomatic) — one level, explicit, fast
type ShallowPartial<T> = { [K in keyof T]?: T[K] };
// If deep partial is truly needed, use an already-vetted library type (type-fest).
```

---

### Project References for Monorepos

**SHOULD** use TypeScript project references (`"references"` in `tsconfig.json`) in monorepos instead of a single root config that includes all packages. Project references enable incremental builds and allow `tsc --build` to skip unchanged packages.

```jsonc
// root tsconfig.json in a monorepo
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/api" },
    { "path": "./packages/web" }
  ]
}
```

---

## Verification Checklist

- [ ] `tsconfig.json` has `"strict": true`
- [ ] `"exactOptionalPropertyTypes": true` is set
- [ ] `"noUncheckedIndexedAccess": true` is set
- [ ] `"moduleResolution"` is `"NodeNext"` or `"Bundler"` — not `"node"` or `"classic"`
- [ ] Relative imports include explicit file extensions under `NodeNext` resolution
- [ ] No deeply nested conditional types (> 2 `infer` levels) — use mapped types or `type-fest` instead
- [ ] Monorepos use project references, not a single flat `include` glob across all packages
- [ ] `"skipLibCheck": true` is set to prevent slowdowns from third-party `.d.ts` errors
