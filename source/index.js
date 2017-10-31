/**
 * structure:
 *   Redux
 *     ReduxEntry.middleware
 *       Entry (Your Customized Function)
 */

const createReduxEntry = () => {
  let store = null
  const entryMap = {} // actionType - entryFunction

  const onAction = (action) => {
    const entryFunction = entryMap[ action.type ]
    return entryFunction && entryFunction(store, action) // if the entryFunction returns true, the Action is Blocked. meaning follow up middleware || reducers will not receive this Action
  }

  const middleware = (reduxMiddlewareStore) => { // this store only gives us `getState` and `dispatch`, no `subscribe`
    if (typeof (reduxMiddlewareStore.getState) !== 'function' || typeof (reduxMiddlewareStore.dispatch) !== 'function') throw new Error('[ReduxEntry][middleware] invalid reduxMiddlewareStore')
    if (store !== null) throw new Error('[ReduxEntry][middleware] already set reduxMiddlewareStore')
    store = reduxMiddlewareStore
    return (next) => (action) => (onAction(action) === true) || next(action) // TODO: is this useful? if onAction return true, skip following middleware
  }

  const setEntry = (actionType, entryFunction) => {
    if (typeof (actionType) !== 'string') throw new Error(`[ReduxEntry][setEntry] non-string actionType: ${actionType}`)
    if (typeof (entryFunction) !== 'function') throw new Error(`[ReduxEntry][setEntry] non-function entryFunction: ${actionType}, ${entryFunction}`)
    if (entryMap[ actionType ]) console.warn(`[ReduxEntry][setEntry] possible unexpected entry overwrite: ${actionType}`)
    entryMap[ actionType ] = entryFunction
  }

  const setEntryMap = (entryMap) => { for (const [ actionType, entryFunction ] of Object.entries(entryMap)) setEntry(actionType, entryFunction) }

  return { middleware, setEntry, setEntryMap }
}

// Simple store for state, with a handy function to wrapEntry
const createStateStore = (state) => {
  if (state === undefined) throw new Error('[ReduxEntry][createStateStore] initialState expected')
  return {
    getState: () => state,
    setState: (nextState) => (state = nextState),
    wrapEntry: (func) => (store, action) => func(state, store, action)
  }
}

// Handy function to update both the stateStore and ReduxStore
const createStateStoreReducer = (actionType, { getState, setState }) => (state, { type, payload }) => { // the reducer, NOTE the action should be like `{ type, payload }`
  type === actionType && setState(payload)
  return getState()
}

const createStateStoreMergeReducer = (actionType, { getState, setState }) => (state, { type, payload }) => { // the reducer, NOTE the action should be like `{ type, payload }`
  type === actionType && setState(objectMerge(getState(), payload))
  return getState()
}

const objectMerge = (object, merge) => {
  for (const [ key, value ] of Object.entries(merge)) { // check if has new data
    if (object[ key ] === value) continue
    return { ...object, ...merge }
  }
  return object
}

export {
  createReduxEntry,
  createStateStore,
  createStateStoreReducer,
  createStateStoreMergeReducer
}
