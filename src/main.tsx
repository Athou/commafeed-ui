import "@fontsource/open-sans"
import { store } from "app/store"
import { App } from "components/App"
import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
)
