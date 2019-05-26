import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiThemeProvider } from "@material-ui/core/styles"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import useLocalStorage from "react-use/lib/useLocalStorage"
import "typeface-roboto"
import { App } from "./app/App"
import "./index.css"
import { Login } from "./login/Login"
import { Routes } from "./Routes"
import { Themes } from "./Themes"

export const GlobalContext = React.createContext({} as { darkMode: boolean; setDarkMode: (dark: boolean) => void })

const Root: React.FC = () => {
    const [darkMode, setDarkMode] = useLocalStorage("darkMode", false)

    return (
        <MuiThemeProvider theme={darkMode ? Themes.dark : Themes.default}>
            <GlobalContext.Provider value={{ darkMode, setDarkMode }}>
                <CssBaseline />
                <BrowserRouter>
                    <Switch>
                        <Route path={Routes.app.root.template()} component={App} />
                        <Route path={Routes.login.template()} component={Login} />
                        <Route render={() => <Redirect to={Routes.app.root.create({})} />} />
                    </Switch>
                </BrowserRouter>
            </GlobalContext.Provider>
        </MuiThemeProvider>
    )
}

ReactDOM.render(<Root />, document.getElementById("root"))
