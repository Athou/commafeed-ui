import "@fontsource/open-sans"
import { store } from "app/store"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { App } from "./App"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
)
