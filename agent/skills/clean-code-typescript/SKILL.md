---
name: clean-code-typescript
description: Enforces maintainability, immutability defaults, and structural guardrails in TypeScript codebases. Activate when refactoring TypeScript, reviewing class design, writing service layers, or asked about clean code practices in TypeScript.
---

## Role & Intent

When this skill is active, treat mutability as a liability, index-based loops as a red flag, and `new SomeDependency()` inside a class as a coupling defect. Push toward code that is easy to test, easy to delete, and impossible to corrupt through accidental mutation.

---

## Core Directives

### Immutability by Default

**MUST** mark class fields and object type properties `readonly` unless mutation is an explicit, documented requirement.

**MUST** type array parameters and return values as `ReadonlyArray<T>` (or `readonly T[]`) when the function must not mutate the array.

**MUST NOT** mutate arrays with `push`, `pop`, `splice`, `sort`, or `reverse` on values not owned by the current scope. Use non-mutating alternatives (`[...arr, item]`, `arr.filter(...)`, `[...arr].sort(...)`).

```ts
// Incorrect (Avoid)
class UserService {
  users: User[] = [];

  add(user: User) {
    this.users.push(user);
  }
}

// Correct (Idiomatic)
class UserService {
  readonly users: ReadonlyArray<User>;

  constructor(users: ReadonlyArray<User> = []) {
    this.users = users;
  }

  add(user: User): UserService {
    return new UserService([...this.users, user]);
  }
}
```

---

### Array Iteration

**MUST** prefer `.map()`, `.filter()`, `.reduce()`, and `.find()` for transformations and queries on arrays.

**MUST** use `for...of` when a side-effectful loop is genuinely needed (e.g., sequential async iteration).

**MUST NOT** use index-based `for (let i = 0; ...)` loops unless the index is semantically required (e.g., comparing adjacent elements).

**MUST NOT** use `for...in` on arrays — it iterates enumerable keys (strings), not values, and includes prototype properties.

```ts
// Incorrect (Avoid)
const result = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].active) result.push(users[i].name);
}

// Incorrect (Avoid)
for (const i in users) {
  console.log(users[i]);
}

// Correct (Idiomatic)
const result = users
  .filter((u) => u.active)
  .map((u) => u.name);

// Correct (Idiomatic) — sequential async side effects
for (const user of users) {
  await notifyUser(user);
}
```

---

### Dependency Injection

**MUST** receive dependencies (loggers, repositories, HTTP clients, config) through the constructor or function parameter — never instantiate them inside a class or service body.

**MUST NOT** call `new ConcreteClass()` inside a service for anything that crosses a boundary (DB, network, file system). That coupling makes unit testing impossible without module-level mocking hacks.

**SHOULD** type injected dependencies against an interface or abstract type, not the concrete implementation, so the injection point is a seam.

```ts
// Incorrect (Avoid) — hardcoded instantiation
class OrderService {
  private db = new PostgresDatabase();
  private logger = new WinstonLogger();

  async getOrder(id: string) {
    this.logger.info(`Fetching order ${id}`);
    return this.db.query(`SELECT * FROM orders WHERE id = $1`, [id]);
  }
}

// Correct (Idiomatic) — injected dependencies
interface Database {
  query<T>(sql: string, params: unknown[]): Promise<T[]>;
}

interface Logger {
  info(message: string): void;
}

class OrderService {
  constructor(
    private readonly db: Database,
    private readonly logger: Logger,
  ) {}

  async getOrder(id: string) {
    this.logger.info(`Fetching order ${id}`);
    return this.db.query(`SELECT * FROM orders WHERE id = $1`, [id]);
  }
}
```

---

## Verification Checklist

- [ ] All class fields that are not intentionally mutable are marked `readonly`
- [ ] Array parameters that must not be mutated use `ReadonlyArray<T>` / `readonly T[]`
- [ ] No `push` / `pop` / `splice` / `sort` / `reverse` on externally-owned arrays
- [ ] No `for...in` on arrays; no index-based `for` loops unless the index is semantically required
- [ ] Transformations use `.map()` / `.filter()` / `.reduce()`; sequential side effects use `for...of`
- [ ] No `new ConcreteClass()` for cross-boundary dependencies inside a class body
- [ ] Injected dependencies are typed against interfaces / abstract types, not concrete classes
