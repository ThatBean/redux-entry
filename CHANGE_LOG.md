# Change Log

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


#### `createStateStore`

`setState` now auto merge `nextState`:

`setState: (nextState) => (state = { ...state, ...nextState })`

###### *previous behavior: `setState: (nextState) => (state = nextState)`*


#### `createStateStoreReducer`

will not try to get and patch `initialState`, this should not affect common usage with `createStateStore`

--- --- --- --- --- --- --- --- --- --- --- --- ---
