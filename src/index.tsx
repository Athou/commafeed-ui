import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiThemeProvider } from "@material-ui/core/styles"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import "typeface-roboto"
import { App } from "./app/App"
import "./index.css"
import { Login } from "./login/Login"
import { Routes } from "./Routes"
import { DefaultTheme } from "./Theme"

const Root: React.FC = () => {
    return (
        <MuiThemeProvider theme={DefaultTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Switch>
                    <Route path={Routes.app.root.template()} component={App} />
                    <Route path={Routes.login.template()} component={Login} />
                    <Route render={() => <Redirect to={Routes.app.root.create({})} />} />
                </Switch>
            </BrowserRouter>
        </MuiThemeProvider>
    )
}

ReactDOM.render(<Root />, document.getElementById("root"))
