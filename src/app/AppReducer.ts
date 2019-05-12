import lodash from "lodash"
import { Dispatch, Reducer, useCallback, useRef, useState } from "react"
import { Clients } from ".."
import { Category, CollapseRequest, Entry, ISettings, MarkRequest, ReadingMode, ReadingOrder, Settings } from "../commafeed-api"
import { flattenCategoryTree, visitCategoryTree } from "../utils"

export type EntrySource = "category" | "feed"

interface TreeState {
    root?: Category
}

interface EntriesState {
    id?: string
    source?: EntrySource
    entries?: Entry[]
    selectedEntryId?: string
    selectedEntryExpanded?: boolean
    hasMore?: boolean
    label?: string
    loading: boolean
}

interface RedirectState {
    redirectTo?: string
}

export interface State {
    tree: TreeState
    entries: EntriesState
    settings?: ISettings
    redirect: RedirectState
}

export type Actions =
    | { type: "tree.setRoot"; root: Category }
    | { type: "tree.setCategoryExpanded"; categoryId: number; expanded: boolean }
    | { type: "entries.setSource"; id: string; source: EntrySource }
    | { type: "entries.setEntries"; entries: Entry[]; hasMore: boolean; label: string }
    | { type: "entries.addEntries"; entries: Entry[]; hasMore: boolean }
    | { type: "entries.setSelectedEntryId"; id: string }
    | { type: "entries.setSelectedEntryExpanded"; expanded: boolean }
    | { type: "entries.setRead"; id: string; feedId: number; read: boolean }
    | { type: "entries.setLoading"; loading: boolean }
    | { type: "settings.set"; settings: ISettings }
    | { type: "settings.setReadingMode"; readingMode: ReadingMode }
    | { type: "settings.setReadingOrder"; readingOrder: ReadingOrder }
    | { type: "navigateToSubscribe" }
    | { type: "navigateToRootCategory" }
    | { type: "navigateToCategory"; categoryId: string }
    | { type: "navigateToFeed"; feedId: number }
    | { type: "thunk"; thunk: (dispatch: Dispatch<Actions>, getState: () => State) => void }

const treeReducer: Reducer<TreeState, Actions> = (state, action) => {
    switch (action.type) {
        case "tree.setRoot":
            return { ...state, root: action.root }
        case "tree.setCategoryExpanded": {
            if (!state.root) return state

            const root = lodash.cloneDeep(state.root)
            visitCategoryTree(root, c => {
                if (+c.id === action.categoryId) c.expanded = action.expanded
            })
            return { ...state, root: root }
        }
        case "entries.setRead": {
            if (!state.root) return state

            const root = lodash.cloneDeep(state.root)
            visitCategoryTree(root, c =>
                c.feeds.forEach(f => {
                    if (f.id === action.feedId) f.unread = action.read ? f.unread - 1 : f.unread + 1
                })
            )
            return { ...state, root: root }
        }
        default:
            return state
    }
}

const entriesReducer: Reducer<EntriesState, Actions> = (state, action) => {
    switch (action.type) {
        case "entries.setSource":
            return { ...state, id: action.id, source: action.source }
        case "entries.setEntries":
            return { ...state, entries: action.entries, hasMore: action.hasMore, label: action.label }
        case "entries.addEntries":
            return { ...state, entries: state.entries && state.entries.concat(action.entries), hasMore: action.hasMore }
        case "entries.setSelectedEntryId":
            return { ...state, selectedEntryId: action.id }
        case "entries.setSelectedEntryExpanded":
            return { ...state, selectedEntryExpanded: action.expanded }
        case "entries.setRead":
            const newEntries = state.entries
                ? state.entries.map(e => (e.id === action.id ? Object.assign({}, e, { read: action.read }) : e))
                : undefined
            return { ...state, entries: newEntries }
        case "entries.setLoading":
            return { ...state, loading: action.loading }
        default:
            return state
    }
}

const settingsReducer: Reducer<ISettings | undefined, Actions> = (state, action) => {
    switch (action.type) {
        case "settings.set":
            return action.settings
        case "settings.setReadingMode":
            return state ? { ...state, readingMode: action.readingMode } : undefined
        case "settings.setReadingOrder":
            return state ? { ...state, readingOrder: action.readingOrder } : undefined
        default:
            return state
    }
}

const redirectReducer: Reducer<RedirectState, Actions> = (state, action) => {
    switch (action.type) {
        case "navigateToRootCategory":
            return { ...state, redirectTo: `/app/category/all` }
        case "navigateToCategory":
            return { ...state, redirectTo: `/app/category/${action.categoryId}` }
        case "navigateToFeed":
            return { ...state, redirectTo: `/app/feed/${action.feedId}` }
        case "navigateToSubscribe":
            return { ...state, redirectTo: `/app/subscribe` }
        default:
            return state
    }
}

export const AppReducer: Reducer<State, Actions> = (state, action) => {
    return {
        ...state,
        tree: treeReducer(state.tree, action),
        entries: entriesReducer(state.entries, action),
        settings: settingsReducer(state.settings, action),
        redirect: redirectReducer(state.redirect, action)
    }
}

const ENTRIES_PAGE_SIZE = 50
export const ActionCreator = {
    tree: {
        reload(): Actions {
            return thunk(dispatch => {
                Clients.category.get().then(root => dispatch({ type: "tree.setRoot", root }))
            })
        },
        toggleCategoryExpanded(categoryId: number): Actions {
            return thunk((dispatch, getState) => {
                const state = getState()
                if (!state.tree.root) return

                const category = flattenCategoryTree(state.tree.root).find(c => +c.id === categoryId)
                if (!category) return

                Clients.category
                    .collapse(
                        new CollapseRequest({
                            id: categoryId,
                            collapse: category.expanded
                        })
                    )
                    .then(() =>
                        dispatch({
                            type: "tree.setCategoryExpanded",
                            categoryId,
                            expanded: !category.expanded
                        })
                    )
            })
        }
    },
    entries: {
        setSource(id: string, source: EntrySource): Actions {
            return thunk(dispatch => {
                dispatch({ type: "entries.setSource", id, source })
                dispatch(ActionCreator.entries.reload())
            })
        },

        reload(): Actions {
            return thunk((dispatch, getState) => {
                const state = getState()
                if (!state.entries.id || !state.entries.source || !state.settings) return

                const offset = 0
                const limit = ENTRIES_PAGE_SIZE
                dispatch({ type: "entries.setLoading", loading: true })
                fetchEntries(state.entries.id, state.entries.source, state.settings.readingMode, state.settings.readingOrder, offset, limit)
                    .then(entries =>
                        dispatch({
                            type: "entries.setEntries",
                            entries: entries.entries,
                            hasMore: entries.hasMore,
                            label: entries.name
                        })
                    )
                    .finally(() => dispatch({ type: "entries.setLoading", loading: false }))
            })
        },

        loadMore(): Actions {
            return thunk((dispatch, getState) => {
                const state = getState()
                if (!state.entries.id || !state.entries.source || !state.settings || !state.entries.entries) return

                const offset =
                    state.settings.readingMode === ReadingMode.All
                        ? state.entries.entries.length
                        : state.entries.entries.filter(e => !e.read).length
                const limit = ENTRIES_PAGE_SIZE
                fetchEntries(
                    state.entries.id,
                    state.entries.source,
                    state.settings.readingMode,
                    state.settings.readingOrder,
                    offset,
                    limit
                ).then(entries => dispatch({ type: "entries.addEntries", entries: entries.entries, hasMore: entries.hasMore }))
            })
        },

        selectEntry(entry: Entry, expanded: boolean): Actions {
            return thunk(dispatch => {
                dispatch({ type: "entries.setSelectedEntryId", id: entry.id })
                dispatch({ type: "entries.setSelectedEntryExpanded", expanded })
                if (!entry.read) dispatch(ActionCreator.entries.markAsRead(entry.id, +entry.feedId, true))
            })
        },

        selectNextEntry(): Actions {
            return thunk((dispatch, getState) => {
                const state = getState()
                const entries = state.entries.entries
                if (!entries) return

                const currentEntry = entries.find(e => e.id === state.entries.selectedEntryId)
                let nextEntryIndex = -1
                if (!currentEntry) {
                    if (entries.length > 0) nextEntryIndex = 0
                } else {
                    const currentEntryIndex = entries.indexOf(currentEntry)
                    if (currentEntryIndex < entries.length - 1) nextEntryIndex = currentEntryIndex + 1
                }

                if (nextEntryIndex >= 0) {
                    const nextEntry = entries[nextEntryIndex]
                    dispatch(ActionCreator.entries.selectEntry(nextEntry, true))
                }
            })
        },

        selectPreviousEntry(): Actions {
            return thunk((dispatch, getState) => {
                const state = getState()
                const entries = state.entries.entries
                if (!entries) return

                const currentEntry = entries.find(e => e.id === state.entries.selectedEntryId)
                let previousEntryIndex = -1
                if (currentEntry) {
                    const currentEntryIndex = entries.indexOf(currentEntry)
                    if (currentEntryIndex > 0) previousEntryIndex = currentEntryIndex - 1
                }

                if (previousEntryIndex >= 0) {
                    const previousEntry = entries[previousEntryIndex]
                    dispatch(ActionCreator.entries.selectEntry(previousEntry, true))
                }
            })
        },

        markAsRead(id: string, feedId: number, read: boolean): Actions {
            return thunk(dispatch => {
                Clients.entry.mark(new MarkRequest({ id, read })).then(() => dispatch({ type: "entries.setRead", id, feedId, read }))
            })
        }
    },

    settings: {
        setReadingMode(readingMode: ReadingMode): Actions {
            return thunk((dispatch, getState) => {
                dispatch({ type: "settings.setReadingMode", readingMode })
                Clients.user.settingsPost(new Settings(getState().settings)).then(() => dispatch(ActionCreator.entries.reload()))
            })
        },

        setReadingOrder(readingOrder: ReadingOrder): Actions {
            return thunk((dispatch, getState) => {
                dispatch({ type: "settings.setReadingOrder", readingOrder })
                Clients.user.settingsPost(new Settings(getState().settings)).then(() => dispatch(ActionCreator.entries.reload()))
            })
        },

        reload(): Actions {
            return thunk(dispatch => {
                Clients.user.settingsGet().then(settings => {
                    dispatch({ type: "settings.set", settings })
                    dispatch(ActionCreator.entries.reload())
                })
            })
        }
    },

    redirect: {
        navigateToSubscribe(): Actions {
            return { type: "navigateToSubscribe" }
        },

        navigateToRootCategory(): Actions {
            return { type: "navigateToRootCategory" }
        },

        navigateToCategory(categoryId: string): Actions {
            return { type: "navigateToCategory", categoryId }
        },

        navigateToFeed(feedId: number): Actions {
            return { type: "navigateToFeed", feedId }
        }
    }
}

function fetchEntries(
    id: string,
    source: EntrySource,
    readingMode: ReadingMode,
    readingOrder: ReadingOrder,
    offset: number,
    limit: number
) {
    switch (source) {
        case "category":
            return Clients.category.entries(id, readingMode, undefined, offset, limit, readingOrder)
        case "feed":
            return Clients.feed.entries(id, readingMode, undefined, offset, limit, readingOrder)
        default:
            throw new Error()
    }
}

function thunk(thunk: (dispatch: Dispatch<Actions>, getState: () => State) => void): Actions {
    return { type: "thunk", thunk }
}

// adapted from https://github.com/nathanbuchar/react-hook-thunk-reducer
export function useThunkReducer(reducer: Reducer<State, Actions>, initialArg: State): [State, Dispatch<Actions>] {
    const [hookState, setHookState] = useState(initialArg)

    const state = useRef(hookState)
    const getState = useCallback(() => state.current, [])
    const setState = useCallback(newState => {
        state.current = newState
        setHookState(newState)
    }, [])

    const reduce = useCallback(action => reducer(getState(), action), [reducer, getState])
    const dispatch: Dispatch<Actions> = useCallback(
        (action: Actions) => {
            if (action.type === "thunk") action.thunk(dispatch, getState)
            else setState(reduce(action))
        },
        [getState, setState, reduce]
    )

    return [hookState, dispatch]
}
