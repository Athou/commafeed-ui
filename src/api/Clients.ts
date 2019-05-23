import { CategoryClient, EntryClient, FeedClient, ServerClient, UserClient } from "./commafeed-api"

const baseUrl = "/rest"
const interceptingFetch = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init)
    if (response.status === 401) {
        window.location.replace("/login")
        return Promise.reject(response)
    }

    return Promise.resolve(response)
}
const http = { fetch: interceptingFetch }

export const Clients = {
    category: new CategoryClient(baseUrl, http),
    entry: new EntryClient(baseUrl, http),
    feed: new FeedClient(baseUrl, http),
    server: new ServerClient(baseUrl, http),
    user: new UserClient(baseUrl, http)
}
