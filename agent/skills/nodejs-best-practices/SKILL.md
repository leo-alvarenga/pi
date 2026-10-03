---
name: nodejs-best-practices
description: Enforces event loop safety, non-blocking async patterns, and runtime boundary validation in Node.js. Activate when building Node.js APIs, writing server-side TypeScript/JavaScript, handling HTTP requests, or processing environment configuration.
---

## Role & Intent

When this skill is active, treat every blocking call in a server path as a production incident waiting to happen. Enforce async-first I/O, schema validation at all trust boundaries, and explicit concurrency control.

---

## Core Directives

### No Blocking Calls in Server Paths

**MUST NOT** use synchronous filesystem, crypto, or DNS methods (`fs.readFileSync`, `crypto.pbkdf2Sync`, `dns.lookupSync`, etc.) anywhere the event loop is live — i.e., in request handlers, middleware, service constructors called at request time, or module-level startup code that runs per-request.

**MUST** use their async counterparts (`fs.promises.readFile`, `crypto.pbkdf2`, etc.) and `await` them.

```ts
// Incorrect (Avoid) — blocks the event loop for every request
import fs from 'node:fs';

app.get('/config', (req, res) => {
  const data = fs.readFileSync('./config.json', 'utf8');
  res.json(JSON.parse(data));
});

// Correct (Idiomatic)
import fs from 'node:fs/promises';

app.get('/config', async (req, res) => {
  const data = await fs.readFile('./config.json', 'utf8');
  res.json(JSON.parse(data));
});
```

---

### Schema Validation at All Trust Boundaries

**MUST** validate and parse all external inputs — HTTP request bodies, query parameters, route params, and `process.env` — with a runtime schema library (Zod, Valibot, or TypeBox) before they touch application logic.

**MUST NOT** assume TypeScript types alone guarantee runtime safety. A TypeScript type on an unvalidated `req.body` is documentation, not a contract.

```ts
// Incorrect (Avoid) — trusting the type without parsing
interface CreateUserBody { name: string; email: string }

app.post('/users', (req, res) => {
  const body = req.body as CreateUserBody; // no validation
  createUser(body.name, body.email);
});

// Correct (Idiomatic) — parse first, then use
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

app.post('/users', async (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json(result.error.format());
  const { name, email } = result.data;
  await createUser(name, email);
  res.status(201).end();
});
```

**MUST** validate `process.env` at startup, not inline:

```ts
// Correct — validate env once at startup
import { z } from 'zod';

const Env = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
});

export const env = Env.parse(process.env);
```

---

### Explicit Async & Concurrency Control

**MUST** `await` every Promise. Floating promises (fire-and-forget without `.catch`) silently swallow errors.

**MUST** use `Promise.all` for concurrent independent async operations instead of sequential `await` chains.

**MUST** use `Promise.allSettled` when partial failure is acceptable and each result must be inspected individually.

**MUST NOT** `await` inside a `forEach` — it does not wait for the promises.

```ts
// Incorrect (Avoid) — sequential, slow; floating promise in forEach
const ids = ['a', 'b', 'c'];
ids.forEach(async (id) => {
  await processItem(id); // forEach ignores the returned promise
});

// Incorrect (Avoid) — sequential awaits when work is independent
const userA = await fetchUser('a');
const userB = await fetchUser('b');

// Correct (Idiomatic) — concurrent
const [userA, userB] = await Promise.all([fetchUser('a'), fetchUser('b')]);

// Correct (Idiomatic) — concurrent with partial-failure tolerance
const results = await Promise.allSettled(ids.map(processItem));
for (const result of results) {
  if (result.status === 'rejected') logger.error(result.reason);
}
```

---

## Verification Checklist

- [ ] No `*Sync` I/O methods in any server path (request handlers, middleware, services)
- [ ] All `req.body`, `req.query`, `req.params`, and `process.env` are parsed through a Zod / Valibot / TypeBox schema before use
- [ ] No unhandled floating promises — every `Promise` is `await`-ed or has `.catch()`
- [ ] Independent async operations use `Promise.all` / `Promise.allSettled`, not sequential `await`
- [ ] No `await` inside `.forEach()` — use `for...of` or `Promise.all(arr.map(...))`
- [ ] `process.env` validation runs once at module load, result exported as typed `env` object
