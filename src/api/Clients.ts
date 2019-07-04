import { History } from "history"
import { CategoryClient, EntryClient, FeedClient, ServerClient, UserClient } from "./commafeed-api"

const interceptingFetch = (history: History) => async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init)
    if (response.status === 401) {
        history.push("/login")
        return Promise.reject(response)
    }

    return Promise.resolve(response)
}

export class Clients {
    category: CategoryClient
    entry: EntryClient
    feed: FeedClient
    server: ServerClient
    user: UserClient

    constructor(history: History, baseUrl: string = "rest") {
        const http = { fetch: interceptingFetch(history) }
        this.category = new CategoryClient(baseUrl, http)
        this.entry = new EntryClient(baseUrl, http)
        this.feed = new FeedClient(baseUrl, http)
        this.server = new ServerClient(baseUrl, http)
        this.user = new UserClient(baseUrl, http)
    }
}
