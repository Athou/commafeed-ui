import lodash from "lodash"
import { Reducer } from "react"
import { clients } from ".."
import { Category, CollapseRequest, Entry, ISettings, MarkRequest, ReadingMode, ReadingOrder, Settings } from "../api/commafeed-api"
import { flattenCategoryTree, visitCategoryTree } from "../api/utils"
import { Routes } from "../Routes"
import { Thunk } from "../thunk-reducer"

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
            // remove already existing entries
            const entriesToAdd = action.entries.filter(e => !lodash.some(state.entries, { id: e.id }))
            return { ...state, entries: state.entries && state.entries.concat(entriesToAdd), hasMore: action.hasMore }
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
            return { ...state, redirectTo: Routes.app.root.create({}) }
        case "navigateToCategory":
            return { ...state, redirectTo: Routes.app.category.create({ categoryId: action.categoryId }) }
        case "navigateToFeed":
            return { ...state, redirectTo: Routes.app.feed.create({ feedId: String(action.feedId) }) }
        case "navigateToSubscribe":
            return { ...state, redirectTo: Routes.app.subscribe.create({}) }
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
        reload(): Thunk<State, Actions> {
            return dispatch => {
                clients.category.get().then(root => dispatch({ type: "tree.setRoot", root }))
            }
        },
        toggleCategoryExpanded(categoryId: number): Thunk<State, Actions> {
            return (dispatch, getState) => {
                const state = getState()
                if (!state.tree.root) return

                const category = flattenCategoryTree(state.tree.root).find(c => +c.id === categoryId)
                if (!category) return

                dispatch({
                    type: "tree.setCategoryExpanded",
                    categoryId,
                    expanded: !category.expanded
                })
                clients.category.collapse(
                    new CollapseRequest({
                        id: categoryId,
                        collapse: category.expanded
                    })
                )
            }
        }
    },
    entries: {
        setSource(id: string, source: EntrySource): Thunk<State, Actions> {
            return dispatch => {
                dispatch({ type: "entries.setSource", id, source })
                dispatch(ActionCreator.entries.reload())
            }
        },

        reload(): Thunk<State, Actions> {
            return (dispatch, getState) => {
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
            }
        },

        loadMore(): Thunk<State, Actions> {
            return (dispatch, getState) => {
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
            }
        },

        selectEntry(entry: Entry): Thunk<State, Actions> {
            return (dispatch, getState) => {
                const state = getState()
                const wasExpanded = entry.id === state.entries.selectedEntryId ? state.entries.selectedEntryExpanded : false
                dispatch({ type: "entries.setSelectedEntryId", id: entry.id })
                dispatch({ type: "entries.setSelectedEntryExpanded", expanded: !wasExpanded })
                if (!entry.read && !wasExpanded) dispatch(ActionCreator.entries.markAsRead(entry.id, +entry.feedId, true))
            }
        },

        selectNextEntry(): Thunk<State, Actions> {
            return (dispatch, getState) => {
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
                    dispatch(ActionCreator.entries.selectEntry(nextEntry))
                }
            }
        },

        selectPreviousEntry(): Thunk<State, Actions> {
            return (dispatch, getState) => {
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
                    dispatch(ActionCreator.entries.selectEntry(previousEntry))
                }
            }
        },

        markAsRead(id: string, feedId: number, read: boolean): Thunk<State, Actions> {
            return dispatch => {
                dispatch({ type: "entries.setRead", id, feedId, read })
                clients.entry.mark(new MarkRequest({ id, read }))
            }
        },

        markAllAsRead(id: string, source: EntrySource, olderThan: number): Thunk<State, Actions> {
            return dispatch => {
                dispatch({ type: "entries.setLoading", loading: true })
                const service = source === "category" ? clients.category : clients.feed
                service.mark(new MarkRequest({ id, olderThan, read: true })).then(() => {
                    dispatch(ActionCreator.tree.reload())
                    dispatch(ActionCreator.entries.reload())
                })
            }
        }
    },

    settings: {
        setReadingMode(readingMode: ReadingMode): Thunk<State, Actions> {
            return (dispatch, getState) => {
                dispatch({ type: "settings.setReadingMode", readingMode })
                dispatch(ActionCreator.entries.reload())
                clients.user.settingsPost(new Settings(getState().settings))
            }
        },

        setReadingOrder(readingOrder: ReadingOrder): Thunk<State, Actions> {
            return (dispatch, getState) => {
                dispatch({ type: "settings.setReadingOrder", readingOrder })
                dispatch(ActionCreator.entries.reload())
                clients.user.settingsPost(new Settings(getState().settings))
            }
        },

        reload(): Thunk<State, Actions> {
            return dispatch => {
                clients.user.settingsGet().then(settings => {
                    dispatch({ type: "settings.set", settings })
                    dispatch(ActionCreator.entries.reload())
                })
            }
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
            return clients.category.entries(id, readingMode, undefined, offset, limit, readingOrder)
        case "feed":
            return clients.feed.entries(id, readingMode, undefined, offset, limit, readingOrder)
        default:
            throw new Error()
    }
}
