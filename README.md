# mpunks app

## Ethereum RPC configuration

Read-only browsing defaults to the free, keyless PublicNode endpoint at
`https://ethereum.publicnode.com`. Set `REACT_APP_MAINNET_URL` to override it.
An empty value uses the default. Connected wallets continue to use their own provider.

When deploying, remove the old Alchemy URL from the hosting environment (or set
`REACT_APP_MAINNET_URL=https://ethereum.publicnode.com`) and rebuild the app.
Vite embeds this value at build time; changing the environment alone
does not update an existing bundle. The legacy `eth-mainnet.alchemyapi.io` hostname
no longer resolves.

PublicNode supports punk rendering and recent mint queries without a key. Wallet
lookup currently scans historical Transfer events, which the public endpoint
rejects without a personal token. The UI reports lookup failures instead of
presenting them as an empty wallet. Restoring historical wallet lookup requires a
provider with sufficient history access and a separate change to the full-chain
event query. Public RPC endpoints may apply rate limits.

## Development and deployment

Use Node.js 24 (`nvm install && nvm use`) and npm:

```sh
npm ci
npm start
npm test
npm run build
npm run preview
```

`npm run build` checks TypeScript and produces the static site in `build/`.
Vite handles development and production builds, Dart Sass compiles styles, and
Vitest runs the tests. No native Node Sass bindings or legacy OpenSSL flags are
required. The UI and wallet libraries retain their compatible major versions.
The checked-in `.npmrc` preserves the existing React 17 / React95 v5 pairing
with `legacy-peer-deps`; React95 v5 declares an older React peer range.

Vercel reads Node `24.x` from `package.json`. `vercel.json` selects Vite, runs
`npm ci` and `npm run build`, serves `build/`, and supports direct navigation to
`/explore`, `/mine`, and `/faq`. If the dashboard still reports Node 14, select
**Settings → Build and Deployment → Node.js Version → 24.x** and redeploy the
updated branch. RPC environment changes also require rebuilding.

`REACT_APP_MAINNET_URL` remains supported with the same name. It is a public,
build-time browser setting; do not put private credentials in client variables.
