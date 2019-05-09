import { Dispatch } from "react";
import { Clients } from "..";
import { Entries, MarkRequest, ReadingMode, ReadingOrder } from "../commafeed-api";
import { Actions, EntrySource } from "./AppReducer";

// used to orchestrate more complex tasks than dispatching an action to change the state
export class AppController {
    constructor(private dispatch: Dispatch<Actions>) { }

    reloadTree() {
        Clients.category.get().then(root => this.dispatch({ type: "tree.setRoot", root }))
    }

    reloadEntries(id: string, source: EntrySource, readingMode: ReadingMode, readingOrder: ReadingOrder) {
        this.dispatch({ type: "entries.setLoading", loading: true })

        let promise: Promise<Entries>
        switch (source) {
            case "category":
                promise = Clients.category.entries(id, readingMode, undefined, undefined, undefined, readingOrder)
                break
            case "feed":
                promise = Clients.feed.entries(id, readingMode, undefined, undefined, undefined, readingOrder)
                break
            default: throw new Error()
        }

        promise
            .then(entries => this.dispatch({ type: "entries.setEntries", entries: entries.entries, label: entries.name }))
            .finally(() => this.dispatch({ type: "entries.setLoading", loading: false }))
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