# Change Log

--- --- --- --- --- --- --- --- --- --- --- --- ---

## 0.1.4

do not expose `"module": "module/index.js"` in `package.json`

--- --- --- --- --- --- --- --- --- --- --- --- ---

## 0.1.3

remove usage of `Object.entries()` since `babel-preset-env` will not polyfill.

--- --- --- --- --- --- --- --- --- --- --- --- ---

## 0.1.2

add `createStateStoreMergeReducer`

--- --- --- --- --- --- --- --- --- --- --- --- ---

## 0.1.1


#### `createStateStore`

drop `setState` auto merge `nextState`added in 0.1.0


#### `createStateStoreReducer`

will return state form `getState`, instead of direct return


#### arguments check

add arguments check for `createReduxEntry`, `createStateStore`

--- --- --- --- --- --- --- --- --- --- --- --- ---

## 0.1.0


#### Full functional

use:

```js
import { createReduxEntry } from 'redux-entry'
const reduxEntry = createReduxEntry()
// or
const { middleware, setEntry, setEntryMap } = createReduxEntry()
```

instead of:

```js
import { ReduxEntry } from 'redux-entry'
const reduxEntry = new ReduxEntry()
```


#### `createStateStore` [reverted in 0.1.1]

`setState` now auto merge `nextState`:

`setState: (nextState) => (state = { ...state, ...nextState })`

###### *previous behavior: `setState: (nextState) => (state = nextState)`*


#### `createStateStoreReducer`

will not try to get and patch `initialState`, this should not affect common usage with `createStateStore`

--- --- --- --- --- --- --- --- --- --- --- --- ---
