<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Conventions

## Invariants

- Endpoint paths live only in `src/api/*.api.ts`. Nothing else hardcodes one.
- Both the response envelope and the error body are typed in `types/api.type.ts`
  and consumed as `data?.data`. Do not unwrap the envelope in `apiClient`.
- `types/api.type.ts` marks `meta` optional because the API omits it on
  single-resource and unpaginated endpoints.
- Money arrives as strings (`Service.price`, `Payment.amount`) because Prisma
  `Decimal` serializes that way.
- `next.config.ts` uses Next.js server output, so dynamic route segments can be
  rendered per request. In Next.js 16, page `searchParams` are asynchronous.
- Domain types mirror the API's Prisma schema. When a model changes there, update
  the type here rather than inferring it from a response.
- Validation schemas mirror the API's zod schemas, including the wording of
  messages, so the user sees the same error text the API would produce.
- `src/components/ui/**` is third-party shadcn/`@base-ui/react` output with
  Biome overrides in `biome.json`. Do not restructure it; add a rule exception
  there instead of rewriting generated primitives.

## Multipart uploads

Three different shapes exist; do not unify them.

| Endpoint | Shape |
| --- | --- |
| `POST /auth/register`, `PATCH /users/profile` | Flat multipart text fields plus the file. `req.body` is parsed directly by zod. |
| `POST /requests`, `POST /resolver/apply-as-resolver` | A `data` field holding a JSON string, plus the files. The controller does `JSON.parse(req.body.data)`. |
| `POST /services`, `POST /services/categories` | Plain JSON, no file. |

Only the second form can express the nested `location` object on a request.
