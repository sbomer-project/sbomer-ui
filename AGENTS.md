# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack

This is a **TypeScript + React** SPA using the **[Carbon Design System](https://carbondesignsystem.com/) (`@carbon/react` v11)** as the sole UI framework.

When working on UI components, the **Carbon MCP server** (`carbon-mcp`) is available for component APIs, design token references, and code examples. Prefer existing Carbon components over custom implementations.

## Commands (run from `ui/`)

```bash
npm run start:dev          # Dev server (webpack HMR)
npm test                   # Jest (all tests)
npm test -- --testPathPattern=Utils   # Single test file
npm run ci-checks          # type-check + lint + test:coverage (CI gate)
npm run format             # Prettier write
npm run format:check       # Prettier check only
npm run type-check         # tsc --noEmit
npm run lint               # eslint
```

**`prebuild` runs `type-check` and `clean` automatically** — `npm run build` will fail fast on TS errors.

For local Helm/Minikube deployment, all scripts are in `hack/` and run from the **repo root** (not `ui/`).

## Architecture

- **All HTTP calls** go through `DefaultSbomerApi` singleton (`ui/src/app/api/DefaultSbomerApi.ts`). Add new API methods there and extend the `SbomerApi` interface in `ui/src/app/types.ts`.
- **Page pattern**: `*Page.tsx` = shell with `<AppLayout>` only; `*PageContent.tsx` = logic and rendering. Hooks named `useFoo.ts` live alongside the component they serve.
- **Data fetching**: hooks use `useAsyncRetry` from `react-use` (imported as `react-use/lib/useAsyncRetry` or `react-use`). Return tuple `[state, actions] as const`.
- **Path alias `@app/*`** maps to `ui/src/app/*` — use it everywhere instead of relative imports.
- **`ui/src/config.js`** sets `window._env_.API_URL` at runtime; edit manually for dev, injected by Helm in cluster.

## Code Style

- **Carbon-only UI**: use `@carbon/react` for all components. No inline `style` props — use `<Stack gap={N}>`, `<Grid>`/`<Column>`, or Carbon tokens.
- **Status/color mapping**: always use helpers from `ui/src/app/utils/Utils.ts` (`generationStatusToColor`, `targetTypeToColor`, etc.) — never hardcode Carbon tag types.
- **Links**: use `CarbonLink as RouterLink` pattern (`<CarbonLink as={RouterLink} to={...}>`) — not plain `<a>` or `<Link>` directly.
- **`sort-imports`** rule is enforced by ESLint (`ignoreDeclarationSort: true`) — member imports within a block must be alphabetically sorted.
- **Unused vars**: prefix with `_` to suppress the lint error (e.g., `_unused`).
- TypeScript is strict (`noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `strictNullChecks`).

## Testing

- Tests run from `ui/` with Jest + `ts-jest` + `jsdom`. The `@app/*` alias works in tests via `jest.config.js` `moduleNameMapper`.
- **`window.matchMedia` must be mocked** for any component using Carbon — already done globally in `ui/jest.setup.js`. New test files don't need to re-mock it.
- CSS/asset imports are mocked via `ui/__mocks__/styleMock.js` and `fileMock.js`.
- Run a **single test file**: `npm test -- --testPathPattern=<filename>` (e.g., `--testPathPattern=Utils`).

## Local Dev Deployment

- Minikube profile: `sbomer`, namespace: `sbomer-test`, release: `sbomer-release`.
- `sbomer-platform/` and `sbomer-local-dev/` are **auto-managed by scripts** — do not manually commit changes to `Chart.yaml`/`Chart.lock` in `sbomer-platform/`.
- Quick rebuild + redeploy after the cluster is running: build the UI into Minikube (`hack/build-local-ui-into-minikube.sh`), then roll the deployment (`kubectl set image deployment/sbomer-release-ui-chart ui-chart=localhost/sbomer-ui:latest -n sbomer-test && kubectl rollout status deployment/sbomer-release-ui-chart -n sbomer-test`).
