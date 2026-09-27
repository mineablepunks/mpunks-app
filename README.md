# mpunks app

## Ethereum RPC configuration

Read-only browsing defaults to the free, keyless PublicNode endpoint at
`https://ethereum.publicnode.com`. Set `REACT_APP_MAINNET_URL` to override it.
An empty value uses the default. Connected wallets continue to use their own provider.

When deploying, remove the old Alchemy URL from the hosting environment (or set
`REACT_APP_MAINNET_URL=https://ethereum.publicnode.com`) and rebuild the app.
Create React App embeds this value at build time; changing the environment alone
does not update an existing bundle. The legacy `eth-mainnet.alchemyapi.io` hostname
no longer resolves.

PublicNode supports punk rendering and recent mint queries without a key. Wallet
lookup currently scans historical Transfer events, which the public endpoint
rejects without a personal token. The UI reports lookup failures instead of
presenting them as an empty wallet. Restoring historical wallet lookup requires a
provider with sufficient history access and a separate change to the full-chain
event query. Public RPC endpoints may apply rate limits.

To generate typescript smart contract bindings:
`npx typechain --target ethers-v5 --out-dir ~/Downloads/abi-types ~/Downloads/abi-types/*.abi`

# Create React App Boilerplate:

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
