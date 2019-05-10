import { Dispatch } from "react";
import { Clients } from "..";
import { MarkRequest, ReadingMode, ReadingOrder } from "../commafeed-api";
import { Actions, EntrySource } from "./AppReducer";

// used to orchestrate more complex tasks than dispatching an action to change the state
export class AppController {

    private static readonly PAGE_SIZE = 50

    constructor(private dispatch: Dispatch<Actions>) { }

    reloadTree() {
        Clients.category.get().then(root => this.dispatch({ type: "tree.setRoot", root }))
    }

    reloadEntries(id: string, source: EntrySource, readingMode: ReadingMode, readingOrder: ReadingOrder) {
        this.dispatch({ type: "entries.setLoading", loading: true })

        const limit = AppController.PAGE_SIZE
        this.fetchEntries(id, source, readingMode, readingOrder, 0, limit)
            .then(entries => this.dispatch({ type: "entries.setEntries", entries: entries.entries, hasMore: entries.hasMore, label: entries.name }))
            .finally(() => this.dispatch({ type: "entries.setLoading", loading: false }))
    }

    loadMoreEntries(id: string, source: EntrySource, readingMode: ReadingMode, readingOrder: ReadingOrder, offset: number) {
        this.dispatch({ type: "entries.setLoading", loading: true })

        const limit = AppController.PAGE_SIZE
        this.fetchEntries(id, source, readingMode, readingOrder, offset, limit)
            .then(entries => this.dispatch({ type: "entries.addEntries", entries: entries.entries, hasMore: entries.hasMore }))
            .finally(() => this.dispatch({ type: "entries.setLoading", loading: false }))
    }

    private fetchEntries(id: string, source: EntrySource, readingMode: ReadingMode, readingOrder: ReadingOrder, offset: number, limit: number) {
        switch (source) {
            case "category":
                return Clients.category.entries(id, readingMode, undefined, offset, limit, readingOrder)
            case "feed":
                return Clients.feed.entries(id, readingMode, undefined, offset, limit, readingOrder)
            default: throw new Error()
        }
    }

    reloadSettings() {
        Clients.user.settingsGet()
            .then(settings => {
                this.dispatch({ type: "settings.setReadingMode", readingMode: settings.readingMode })
                this.dispatch({ type: "settings.setReadingOrder", readingOrder: settings.readingOrder })
            })
    }

    markEntryAsRead(id: string, feedId: number, read: boolean) {
        Clients.entry.mark(new MarkRequest({ id, read }))
            .then(() => this.dispatch({ type: "entries.setRead", id, feedId, read }))
    }
}