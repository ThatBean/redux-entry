/**
 * structure:
 *   Redux
 *     ReduxService.middleware
 *       Entry (Your Customized Function)
 */

class ReduxEntry {
  constructor () {
    this.store = null
    this.entryMap = {} // actionType - entryFunction
    this.middleware = this.middleware.bind(this)
    this.setEntry = this.setEntry.bind(this)
    this.setEntryMap = this.setEntryMap.bind(this)
  }

  middleware (store) {
    this.store = store
    return (next) => (action) => (this.onAction(action) === true) || next(action) // if onAction return true, skip next()
  }

  setEntry (actionType, entryFunction) {
    if (typeof (actionType) !== 'string') return console.warn('[ReduxEntry] skipped non-string actionType:', actionType, entryFunction)
    if (typeof (entryFunction) !== 'function') return console.warn('[ReduxEntry] skipped non-function entryFunction:', actionType, entryFunction)
    if (this.entryMap[ actionType ]) console.warn('[ReduxEntry] possible unexpected entry overwrite:', actionType, entryFunction)
    this.entryMap[ actionType ] = entryFunction
  }

  setEntryMap (entryMap) {
    Object.keys(entryMap).forEach((actionType) => this.setEntry(actionType, entryMap[ actionType ]))
  }

  onAction (action) {
    if (!this.store) return console.warn(`[ReduxEntry] get Action before Store is set. Action Type: ${action.type}`)
    const entryFunction = this.entryMap[ action.type ]
    return entryFunction && entryFunction(this.store, action) // if the entryFunction returns true, the Action is Blocked. meaning follow up middleware || reducers will not receive this Action
  }
}

// Simple store for state, with a handy function to wrapEntry
function createStateStore (initialState = null) {
  let state = initialState
  return {
    getState: () => state,
    setState: (nextState) => (state = nextState),
    wrapEntry: (func) => (store, action) => func(state, store, action)
  }
}

// Handy function to update both the stateStore and ReduxStore
// But this assumes the action is like `{ type, payload }`, and the `payload` is the new data
function createStateStoreReducer (actionType, stateStore) {
  const { getState, setState } = stateStore
  const initialState = getState()
  return (state = initialState, action) => { // the reducer, NOTE the action should be like `{ type, payload }`
    if (action.type !== actionType) return state
    setState({ ...state, ...action.payload })
    return getState()
  }
}

export {
  ReduxEntry, // for multi instance
  createStateStore,
  createStateStoreReducer
}
