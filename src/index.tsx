import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import "semantic-ui-css/semantic.min.css"
import { App } from "./app/App"
import { CategoryClient, EntryClient, FeedClient, ServerClient, UserClient } from "./commafeed-api"
import "./index.css"
import { Login } from "./login/Login"

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

const Root: React.FC = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/app" component={App} />
                    <Route path="/login" component={Login} />
                    <Route render={() => <Redirect to="/app" />} />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

ReactDOM.render(<Root />, document.getElementById("root"))
