import lodash from 'lodash';
import { Reducer } from "react";
import { Category, Entry, ReadingMode, ReadingOrder } from "../commafeed-api";
import { visitCategoryTree } from "../utils";

export type EntrySource = "category" | "feed"

interface TreeState {
    root?: Category
}

interface EntriesState {
    id?: string,
    source?: EntrySource,
    entries?: Entry[],
    hasMore?: boolean,
    label?: string,
    loading: boolean
}

interface SettingsState {
    readingMode?: ReadingMode,
    readingOrder?: ReadingOrder
}

interface RedirectState {
    redirectTo?: string
}

export interface State {
    tree: TreeState,
    entries: EntriesState,
    settings: SettingsState,
    redirect: RedirectState,
}

export type Actions =
    | { type: "tree.setRoot", root: Category }

    | { type: "entries.setSource", id: string, source: EntrySource }
    | { type: "entries.setEntries", entries: Entry[], hasMore: boolean, label: string }
    | { type: "entries.addEntries", entries: Entry[], hasMore: boolean }
    | { type: "entries.setRead", id: string, feedId: number, read: boolean }
    | { type: "entries.setLoading", loading: boolean }

    | { type: "settings.setReadingMode", readingMode: ReadingMode }
    | { type: "settings.setReadingOrder", readingOrder: ReadingOrder }

    | { type: "navigateToSubscribe" }
    | { type: "navigateToRootCategory" }
    | { type: "navigateToCategory", categoryId: string }
    | { type: "navigateToFeed", feedId: number }

const treeReducer: Reducer<TreeState, Actions> = (state, action) => {
    switch (action.type) {
        case "tree.setRoot":
            return { ...state, root: action.root }
        case "entries.setRead":
            if (!state.root)
                return state

            const root = lodash.cloneDeep(state.root)
            visitCategoryTree(root, c => c.feeds.forEach(f => {
                if (f.id === action.feedId)
                    f.unread = action.read ? f.unread - 1 : f.unread + 1
            }))
            return { ...state, root: root }
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
        case "entries.setRead":
            const newEntries = state.entries ?
                state.entries.map(e => e.id === action.id ? Object.assign({}, e, { read: action.read }) : e) :
                undefined
            return { ...state, entries: newEntries }
        case "entries.setLoading":
            return { ...state, loading: action.loading }
        default:
            return state
    }
}

const settingsReducer: Reducer<SettingsState, Actions> = (state, action) => {
    switch (action.type) {
        case "settings.setReadingMode":
            return { ...state, readingMode: action.readingMode }
        case "settings.setReadingOrder":
            return { ...state, readingOrder: action.readingOrder }
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