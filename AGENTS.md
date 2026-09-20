# AGENTS.md

Guidance for AI agents working in this repository.

## Core Rules

### Don't add excessive validation
Write validation only where it is actually required. Do not add defensive checks
"just in case".

- Don't validate the same thing twice, or re-check at multiple layers.
- Don't null/undefined-guard values that the caller or framework already guarantees.
- Don't add fallbacks for impossible states or try/catch blocks that only re-throw or log.
- Don't add type checking in a language/runtime that already enforces it (TypeScript types, Prisma schema constraints, etc.).
- Trust internal code and function contracts. Validate at trust boundaries only: user input at API endpoints and data coming from the network.

```js
// No
if (!cat) return res.status(400).json({ error: "..." });
if (typeof cat !== "object") return res.status(400).json({ error: "..." });
if (!cat.id) return res.status(400).json({ error: "..." });

// Yes
if (!cat) return res.status(404).json({ error: "Cat not found." });
```

### Don't write excess comments
Comments should explain *why*, never *what*. If the code already says it, don't
repeat it.

- No comments restating the code (`// increment counter`, `// return the user`).
- No commented-out code — delete it, git keeps the history.
- No section banners or boilerplate headers (`// ===== Helpers =====`, `// Constructor`).
- No docblocks that just parrot the function signature. Document only non-obvious
  params, side effects, or invariants.
- Prefer clearer names over comments. A well-named function needs no description.
- Keep a comment only when it captures something the code cannot: a workaround,
  a business rule, a subtle timing/dependency constraint, or a non-obvious tradeoff.

```js
// No
// Get the page from the query params
const page = req.query.page || 1;

// Yes
const page = req.query.page || 1;
```

## Match Existing Style
Follow the conventions already in the codebase rather than introducing new patterns.

- `server/`: Express + ESM, 4-space indent, double quotes, routers in `server/routes/`, auth helper in `server/utils/auth.js`, Prisma via `server/db/db.js`.
- `client/`: React 19 + TypeScript + Vite + Tailwind, 2-space indent, double quotes, components in `client/src/components/`, pages in `client/src/pages/`.
- Keep changes scoped to the task. Don't refactor unrelated code.

## Commands
- Server dev: `npm run dev` (in `server/`)
- Server start: `npm start` (in `server/`)
- Prisma seed: `npm run db:seed` (in `server/`)
- Client dev: `npm run dev` (in `client/`)
- Client build: `npm run build` (in `client/`)
- Client lint: `npm run lint` (in `client/`)

Do not run server or frontend to test, server is usually running already during dev
