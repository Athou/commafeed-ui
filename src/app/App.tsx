import React, { Dispatch, useEffect } from "react"
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom"
import styles from "./App.module.css"
import { ActionCreator, Actions, AppReducer, State, useThunkReducer } from "./AppReducer"
import { FeedEdit } from "./content/FeedEdit"
import { FeedEntries } from "./content/FeedEntries"
import { Subscribe } from "./content/Subscribe"
import { Navbar } from "./navbar/Navbar"
import { Sidebar } from "./sidebar/Sidebar"

export const AppContext = React.createContext({} as { state: State; dispatch: Dispatch<Actions> })

export const App: React.FC<RouteComponentProps> = props => {
    const [state, dispatch] = useThunkReducer(AppReducer, {
        tree: {},
        entries: { loading: true },
        settings: undefined,
        redirect: {}
    })

    // load initial data
    useEffect(() => {
        dispatch(ActionCreator.tree.reload())
        dispatch(ActionCreator.settings.reload())
    }, [dispatch])

    // handle redirect
    useEffect(() => {
        if (state.redirect.redirectTo) props.history.push(state.redirect.redirectTo)
    }, [state.redirect.redirectTo, props.history])

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <div className={styles.sidebar}>
                <Sidebar />
            </div>
            <div className={styles.navbar}>
                <Navbar />
            </div>
            <div className={styles.content}>
                <Switch>
                    <Route path={`${props.match.url}/subscribe`} render={() => <Subscribe />} />

                    <Route
                        path={`${props.match.url}/feed/:feedId/edit`}
                        render={props => <FeedEdit feedId={props.match.params.feedId} />}
                    />

                    <Route
                        path={`${props.match.url}/feed/:feedId`}
                        render={props => <FeedEntries source="feed" id={props.match.params.feedId} />}
                    />

                    <Route
                        path={`${props.match.url}/category/:categoryId`}
                        render={props => <FeedEntries source="category" id={props.match.params.categoryId} />}
                    />

                    <Route render={() => <Redirect to={`${props.match.url}/category/all`} />} />
                </Switch>
            </div>
        </AppContext.Provider>
    )
}
