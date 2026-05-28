# Contributing

Thanks for helping improve `z-api-sdk`. This guide covers the local setup, how
the code is organized, and how to add coverage for new Z-API endpoints.

## Prerequisites

- Node.js >= 18
- npm (the repo ships a `package-lock.json`)

## Quick start

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest run (HTTP mocked with MSW)
npm run build       # tsup -> dist/ (ESM + CJS + .d.ts)
```

Run `npm run test:watch` while developing.

## Project layout

```
src/
  client.ts          # ZAPI: resolves credentials, builds the instance-scoped transport, exposes resources
  partner.ts         # ZAPIPartner: account-level client (Bearer auth, API root)
  core/
    http.ts          # generic HttpClient: axios instance, retries, error mapping
    errors.ts        # ZAPIError hierarchy
    types.ts         # ClientOptions, PartnerClientOptions, RequestOptions
  resources/         # one class per Z-API group; each extends APIResource
  types/             # request param + response interfaces, one file per resource
tests/               # vitest specs; HTTP is mocked with MSW (see tests/setup.ts)
```

Every request goes through `HttpClient`, which is constructed with a fully-formed
`baseURL` and default headers. `ZAPI` bakes in `/instances/{id}/token/{token}`
plus the `Client-Token` header; `ZAPIPartner` uses the API root plus an
`Authorization: Bearer` header.

## Adding a new endpoint

The source of truth is the Z-API Postman collection. Always verify the **method,
path, and exact request body** against it before implementing — field names
differ in non-obvious ways (for example, `chatExpiration` vs `expiration`, or the
privacy `group-add` endpoint using `type` instead of `visualizationType`).

1. **Add types** in the matching `src/types/<resource>.ts` (a params interface,
   and a response interface if the shape is known).
2. **Add the method** to the resource class in `src/resources/<resource>.ts`.
   Keep it a thin wrapper:

   ```ts
   sendText(params: SendTextParams, options?: RequestOptions): Promise<SendMessageResponse> {
     return this._client.post("/send-text", { body: params, ...options });
   }
   ```

   Use `query` for query-string params and `encodeURIComponent` for any value
   interpolated into the path.
3. **Export** new types from `src/index.ts` if they are part of the public API.
4. **Write a test** in `tests/` asserting the request method, path, headers, and
   body via an MSW handler.

### Adding a whole new resource

1. Create `src/types/<resource>.ts` and `src/resources/<resource>.ts`
   (extend `APIResource`).
2. Import the class in `src/client.ts`, add a `readonly` field, and instantiate
   it in the constructor.
3. Re-export the class and its types from `src/index.ts`.
4. Add a section to [USAGE.md](./USAGE.md) and update the coverage table.

## Testing conventions

- Tests mock HTTP with MSW; no real network calls. `tests/setup.ts` fails the
  run on any unhandled request, so each test must register a handler.
- Assert the request shape (method, path, `Client-Token`/`Authorization` header,
  body, query) rather than just the return value.
- Cover anything non-obvious: query serialization, path encoding, and bodies
  whose field names are easy to get wrong.

## Before opening a pull request

- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] New/changed endpoints are documented in [USAGE.md](./USAGE.md)
- [ ] New public types are exported from `src/index.ts`

## Commit and release notes

- Write commits in the imperative mood ("Add newsletter resource").
- `dist/` is a build artifact and is gitignored; it is rebuilt automatically by
  the `prepublishOnly` script before publishing — do not commit it.
- Publishing is done with `npm publish` (runs typecheck + tests + build first).
  Bump the version in `package.json` following semver.
