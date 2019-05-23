import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import "semantic-ui-forest-themes/semantic.darkly.min.css"
import { App } from "./app/App"
import "./index.css"
import { Login } from "./login/Login"
import { Routes } from "./Routes"
import "./variables.css"

const Root: React.FC = () => {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path={Routes.app.root.template()} component={App} />
                    <Route path={Routes.login.template()} component={Login} />
                    <Route render={() => <Redirect to={Routes.app.root.create({})} />} />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

ReactDOM.render(<Root />, document.getElementById("root"))
