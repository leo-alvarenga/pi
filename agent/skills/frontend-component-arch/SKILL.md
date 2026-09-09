---
name: frontend-component-arch
description: "Enforces component architecture rules: Generic→Implementation→Usage pattern, 150 LOC limit, separation of concerns, hook composition, colocated structure, and flat barrel exports. Use when scaffolding, reviewing, or refactoring React components."
---

# Component Architecture Rules

## 0. The Ladder (apply in order)

1. Can this be reused from an existing component? Reuse it.
2. Is this used in more than one place? It belongs in `components/`, not inline.
3. Does this exceed ~150 LOC? Extract concerns before writing more.
4. Is this logic or data fetching? It belongs in a hook, not the component.

---

## 1. Generic → Implementation → Usage

A component used in more than one place MUST be implemented once as a generic, then wrapped as a specific implementation:

```
GenericTable        ← accepts any data shape via props
  └─ UserTable      ← binds UserTable-specific types/hooks
       └─ used in DashboardPage, AdminPage
```

Never duplicate component logic across usage sites. Extract the shared generic first.

---

## 2. Component Rules

### MUST NOT:

- Exceed 150 LOC (165 with comments)
- Contain rendering logic beyond prop-to-JSX mapping
- Contain business logic (calculations, derivations, decisions)
- Contain API calls or data integrations

### MUST:

- Call hooks at the top of the function body
- Destructure props inside the function body
- Use native `function` declarations (not arrow functions) for top-level components
- Delegate every non-trivial concern to a dedicated hook

### Example (correct)

```tsx
import { Body, Header, Pagination } from "./components";
import { useTableData } from "./hooks";
import { TableProps } from "./Table.types";

export function Table(props: TableProps) {
  const { data, title } = props;
  const { rows, sort, paginate } = useTableData({ data });

  return (
    <div>
      <Header onSort={sort} title={title} />
      <Body rows={rows} />
      <Pagination paginate={paginate} />
    </div>
  );
}
```

---

## 3. File Structure

Complexity determines structure — never pre-fold:

**Small:**

```
Button/
  index.ts
  Button.tsx
  Button.types.ts
```

**Medium:**

```
Modal/
  index.ts
  Modal.tsx
  Modal.hook.ts
  Modal.types.ts
  Modal.utils.ts
```

**Large:**

```
Table/
  index.ts
  Table.tsx
  hooks/
    index.ts
    useTableData.ts
    usePagination.ts
  types/
    index.ts
    table-props.ts
    table-row.ts
  utils/
    index.ts
    sort-rows.ts
  components/
    TableHeader/
    TableRow/
```

### Naming:

- Component folders: **PascalCase**
- Hook files: `useHookName.ts`
- Type files inside `types/`: `kebab-case.ts`
- Utility files inside `utils/`: `kebab-case.ts`
- Root-level type/util/hook files: `ComponentName.types.ts`, `ComponentName.utils.ts`, `ComponentName.hook.ts`

---

## 4. Hooks

- Named `use<PascalCase>`
- Accept nothing, or a single param object typed `Use<HookName>Params`
- Max ~150 LOC — split by concern if larger
- Composable: may call other hooks, never duplicate logic between them
- No UI references — return data and callbacks only

```ts
export type UsePaginationParams = {
  pageSize?: number;
  initialPage?: number;
};

export function usePagination(params: UsePaginationParams) {
  // ...
}
```

### Placement:

- Used by one component → colocate in `ComponentName.hook.ts` or `hooks/`
- Used by multiple components → move to `src/hooks/`

---

## 5. Colocation

| Artifact               | Belongs at                           |
| ---------------------- | ------------------------------------ |
| Props / internal types | `ComponentName.types.ts` or `types/` |
| Component-only hook    | `ComponentName.hook.ts` or `hooks/`  |
| Component-only util    | `ComponentName.utils.ts` or `utils/` |
| Shared hook            | `src/hooks/`                         |
| Shared util            | `src/utils/`                         |
| API / domain types     | `src/types/`                         |

Never put shared logic inside a component folder. Never put component-specific logic in `src/hooks` or `src/utils`.

---

## 6. Barrel Exports

Every folder exposes a single `index.ts` with flat re-exports:

```ts
// ✅
export * from "./ComponentName";

// ❌
export { ComponentName } from "./ComponentName/ComponentName";
```

Never export child components through a parent's index barrel.

---

## 7. Review Checklist

- [ ] ≤ 150 LOC in the `.tsx` file
- [ ] No business logic in the component
- [ ] No API calls in the component
- [ ] Each concern has a dedicated hook
- [ ] Hooks accept empty or a single param object
- [ ] Types colocated or in `src/types/`
- [ ] `index.ts` barrel exists
- [ ] Flat imports only (`../../components`, not `../../components/Button/Button`)
- [ ] Shared logic extracted before duplicating across usage sites
