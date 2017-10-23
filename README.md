# Redux-Entry

[![npm](https://img.shields.io/npm/v/redux-entry.svg)](https://www.npmjs.com/package/redux-entry)

[Middleware](http://redux.js.org/docs/advanced/Middleware.html) for [Redux](http://redux.js.org/).


## Definition

**Entry** is a function that:
 
 * Target one type of `action`
 * Will be called with `(store, action)`,
   after the `action` is dispatched, but before it reaches the **store reducer**
 * Can block current dispatched `action` by `return true`
 * Has access to `store`.
   Hence you can access current **store state** by `store.getState()`,
   or dispatch some `action` by `store.dispatch`. 
   From there we have some feature like:
   - Block and Redirect `action` to another action type
   - Dispatch multiple `action` from one **Entry**
   - dispatch to another **Entry** (beware of dead loops)


## Usage

```js
import { createReduxEntry, createStateStore, createStateStoreReducer } from 'redux-entry'
```


#### `ReduxEntry`

```js
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createReduxEntry } from 'redux-entry'

const reducer = (state = {}, action) => state // some sample reducer

const { middleware: reduxEntryMiddleware, setEntry, setEntryMap } = createReduxEntry() // get ReduxEntry instance

// add reduxEntry to middleware
const store = createStore(
  reducer,
  // null, // no initialState
  applyMiddleware(reduxEntryMiddleware)
)

// define some entryFunction
const entryFunction0 = (store, action) => {}
const entryFunction1 = ({dispatch, getState}, {type, payload}) => {}
// and set
setEntry('action-type-to-precess-0', entryFunction0)
setEntry('action-type-to-precess-1', entryFunction1)

// or pack them up
const entryMap = {
  'action-type-to-precess-0': entryFunction0,
  'action-type-to-precess-1': entryFunction1
}
// and set
setEntryMap(entryMap)
```


#### `createStateStore` & `createStateStoreReducer`

These are packed handy functions to create **mini-state-store**, if needed to.

**mini-state-store** can be used to offload Redux store reducer codes.

Suppose we have a store state like this:

```js
const storeState = {
  'mini-state-a': {},
  'mini-state-b': {},
  'mini-state-c': {}
}
```

and for each mini state, we have reducers like:

```js
const miniStateReducer = (state, action) => {
  if (action.type === 'mini-state:set-key-0') return { ...state, key0: 0 }
  else if (action.type === 'mini-state:set-key-1') return { ...state, key1: 1 }
  else if (action.type === 'mini-state:set-key-2') return { ...state, key2: 2 }
  else return state
}
```

We might want to 'reduce' the reducer code to a single merge operation:

```js
const miniStateReducer = (state, action) => {
  if (action.type === 'mini-state:update') return { ...state, ...action.payload }
  else return state
}
```

...and put the each reduce action to one entryFunction:

```js
const entryMap = {
  'mini-state:set-key-0': ({ dispatch, getState }, action) => {
    const miniState = getState()['mini-state-a']
    dispatch({ type: 'mini-state:update', payload: { ...miniState, key0: 0 } })
  },
  'mini-state:set-key-1': ({ dispatch, getState }, action) => {
    const miniState = getState()['mini-state-a']
    dispatch({ type: 'mini-state:update', payload: { ...miniState, key1: 1 } })
  },
  'mini-state:set-key-2': ({ dispatch, getState }, action) => {
    const miniState = getState()['mini-state-a']
    dispatch({ type: 'mini-state:update', payload: { ...miniState, key2: 2 } })
  }
}
```

And with `createStateStore` and `createStateStoreReducer`, we get a **mini-state-store**:

```js
import { createStateStore, createStateStoreReducer } from 'redux-entry'

const initialState = {}
const stateStore = createStateStore(initialState)
const { getState, setState, wrapEntry } = stateStore
const reducer = createStateStoreReducer('mini-state:update', stateStore)
const entryMap = {
  'mini-state:set-key-0': wrapEntry((state, { dispatch }, action) => { dispatch({ type: 'mini-state:update', payload: { ...state, key0: 0 } }) }),
  'mini-state:set-key-1': wrapEntry((state, { dispatch }, action) => { dispatch({ type: 'mini-state:update', payload: { ...state, key1: 1 } }) }),
  'mini-state:set-key-2': wrapEntry((state, { dispatch }, action) => { dispatch({ type: 'mini-state:update', payload: { ...state, key2: 2 } }) })
}

export { stateStore, reducer }
```


#### License

[MIT](https://wikipedia.org/wiki/MIT_License).
Issues and Pull Requests are welcomed.
