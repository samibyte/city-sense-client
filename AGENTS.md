<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Conventions

## care-node is the reference

This project mirrors `care-node/client-care-node`. When a file exists in both,
the care-node version is the baseline and the City Sense version is a deliberate
edit of it. Read the care-node file before changing the local one, and do not
introduce a different pattern for something care-node already solved.

Package versions stay on care-node's (`biome` 2.4.2, `typescript` ^5). The
`city-sense-server` repo uses newer versions, but aligning on care-node's
pairing is deliberate: it is what is proven against Next 16.3.4 and shadcn
`base-nova`. The two are separate repositories, so there is no conflict.

## Files that must not be copied from care-node

| Local file | Why it differs |
| --- | --- |
| `src/types/user.type.ts` | `UserRole` is `ADMIN \| RESOLVER \| CITIZEN`; status uses `BANNED`, not `BLOCKED`. Generated from the API's `prisma/schema/enum.prisma`. |
| `src/validation/auth.validation.ts` | Minimum password length is 6, and there is no Bangladesh phone rule. Mirrors the API's `auth.validation.ts`. |
| `src/api/**` | Endpoint paths are the API's, not care-node's. `/auth/login/google`, not `/auth/google`. |
| `src/routes/**` | City Sense roles and pages. No doctor or super-admin entries. |
| `src/lib/apiClient.ts` | Adds the refresh-and-retry interceptor care-node lacks. |
| `src/lib/payment.ts` | No payments domain in care-node. |
| `src/app/**` | City Sense pages. |

## Invariants

- Endpoint paths live only in `src/api/*.api.ts`. Nothing else hardcodes one.
- Both the response envelope and the error body are typed in `types/api.type.ts`
  and consumed as `data?.data`. Do not unwrap the envelope in `apiClient`.
- `types/api.type.ts` marks `meta` optional because the API omits it on
  single-resource and unpaginated endpoints.
- Money arrives as strings (`Service.price`, `Payment.amount`) because Prisma
  `Decimal` serializes that way.
- `next.config.ts` sets `output: "export"`, so a page may not `await searchParams`.
  Read the query string with `useSearchParams` in a client component wrapped in
  `<Suspense>`; see `src/app/payment/`.
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
