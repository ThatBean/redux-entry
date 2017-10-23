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
    store = reduxMiddlewareStore
    return (next) => (action) => (onAction(action) === true) || next(action) // TODO: is this useful? if onAction return true, skip following middleware
  }

  const setEntry = (actionType, entryFunction) => {
    if (typeof (actionType) !== 'string') throw new Error('[ReduxEntry] non-string actionType:', actionType, entryFunction)
    if (typeof (entryFunction) !== 'function') throw new Error('[ReduxEntry] non-function entryFunction:', actionType, entryFunction)
    if (entryMap[ actionType ]) console.warn('[ReduxEntry] possible unexpected entry overwrite:', actionType, entryFunction)
    entryMap[ actionType ] = entryFunction
  }

  const setEntryMap = (entryMap) => { for (const [ actionType, entryFunction ] of Object.entries(entryMap)) setEntry(actionType, entryFunction) }

  return { middleware, setEntry, setEntryMap }
}

// Simple store for state, with a handy function to wrapEntry
const createStateStore = (state = null) => ({
  getState: () => state,
  setState: (nextState) => (state = { ...state, ...nextState }),
  wrapEntry: (func) => (store, action) => func(state, store, action)
})

// Handy function to update both the stateStore and ReduxStore
const createStateStoreReducer = (actionType, { getState, setState }) => (state, { type, payload }) => { // the reducer, NOTE the action should be like `{ type, payload }`
  if (type !== actionType) return state
  setState(payload)
  return getState()
}

export {
  createReduxEntry,
  createStateStore,
  createStateStoreReducer
}
