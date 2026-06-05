# identity-eudi-frontend

A modern React + TypeScript storefront that demonstrates EU Digital Identity
(EUDI) wallet-based verification on top of the
[`identity-eudi-backend`](https://github.com/marcofranceschini015/identity-eudi-backend)
demo service.

It mimics a comparison-portal experience (Check24-style): the user picks a
product, fills in a short form, scans a QR code with their EUDI wallet and
confirms with a one-time code. The page polls the backend for issuance status
and lands on a success screen when the credential is `ISSUED`.

> **Status:** demo / proof of concept. The backend is expected to be running on
> `http://localhost:8080`. Do not deploy this configuration to a real
> environment.

## Tech stack

- [Vite](https://vite.dev/) + [React 18](https://react.dev/) + TypeScript
- [React Router 6](https://reactrouter.com/) for client-side routing
- [Axios](https://axios-http.com/) for the REST client
- [`qrcode.react`](https://github.com/zpao/qrcode.react) for QR rendering
- Plain, dependency-free CSS (no UI kit)

## Prerequisites

- Node.js 20 (an `.nvmrc` is provided — run `nvm use`)
- [pnpm](https://pnpm.io/) ≥ 9 (npm also works)
- The backend running locally — see
  [`identity-eudi-backend/README.md`](../identity-eudi-backend/README.md)

## Getting started

```bash
nvm use        # picks up .nvmrc (Node 20)
pnpm install
pnpm dev
```

Then open <http://localhost:5173>.

Vite proxies requests starting with `/api` to `http://localhost:8080`, so the
frontend talks to the backend without any CORS configuration.

### Scripts

| Script           | What it does                                |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Start the Vite dev server                   |
| `pnpm build`     | Type-check and produce a production bundle  |
| `pnpm preview`   | Serve the production bundle locally         |
| `pnpm typecheck` | Run the TypeScript compiler in `--noEmit`   |

### Configuration

By default the client calls `/api` (proxied to `http://localhost:8080`).
To point at another backend, create a `.env.local`:

```env
VITE_API_BASE_URL=https://api.example.com/api
```

## User flow

1. **Home** — two product tiles: *Bank loan* and *Rent a car*.
2. **Bank loan form** — `first_name`, `last_name`, `iban` with basic IBAN
   validation. Submitting calls
   `POST /api/session` with tenant `check24-bank` and the user data.
3. **Verify** — renders the QR code for `redirectUrl` and the
   `oneTimePassword` from the response. Polls `GET /api/session/{id}` every
   2 seconds:
   - `CREATED` → keep waiting
   - `ISSUED`  → navigate to the success page
   - `FAILED` / `REVOKED` → show an error with a *Try again* button
4. **Success** — confirmation screen with a *Back to home* button.

Errors at any step are surfaced through a non-blocking error box and the user
can retry without losing context.

> *Rent a car* is intentionally a placeholder for now — the tenant is wired in
> [`src/config.ts`](src/config.ts) and the page can be extended in
> [`src/pages/RentACarPage.tsx`](src/pages/RentACarPage.tsx).

## Project layout

```
src/
├── api/
│   ├── sessionClient.ts   # axios client + typed wrappers + ApiError
│   └── types.ts           # shared API DTOs
├── components/
│   ├── ErrorBox.tsx
│   ├── SiteFooter.tsx
│   ├── SiteHeader.tsx
│   └── Spinner.tsx
├── pages/
│   ├── BankLoanFormPage.tsx
│   ├── HomePage.tsx
│   ├── RentACarPage.tsx
│   ├── SuccessPage.tsx
│   └── VerifyPage.tsx
├── styles/global.css
├── App.tsx
├── config.ts
└── main.tsx
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).
