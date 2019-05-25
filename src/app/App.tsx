import { Drawer } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { Dispatch, useEffect } from "react"
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom"
import { Routes } from "../Routes"
import { Thunk, useThunkReducer } from "../thunk-reducer"
import { AppConstants } from "./AppConstants"
import { ActionCreator, Actions, AppReducer, State } from "./AppReducer"
import { FeedEdit } from "./content/FeedEdit"
import { FeedEntries } from "./content/FeedEntries"
import { Subscribe } from "./content/Subscribe"
import { Navbar } from "./navbar/Navbar"
import { Sidebar } from "./sidebar/Sidebar"

const useStyles = makeStyles(theme => ({
    sidebar: {
        width: AppConstants.SIDEBAR_WIDTH,
        backgroundColor: theme.palette.background.paper
    },
    navbar: {
        position: "fixed",
        top: 0,
        height: AppConstants.NAVBAR_HEIGHT,
        left: AppConstants.SIDEBAR_WIDTH,
        right: 0,
        zIndex: 10,
        backgroundColor: theme.palette.background.paper
    },
    content: {
        marginLeft: AppConstants.SIDEBAR_WIDTH,
        paddingTop: AppConstants.NAVBAR_HEIGHT
    }
}))

export const AppContext = React.createContext({} as { state: State; dispatch: Dispatch<Actions | Thunk<State, Actions>> })

export const App: React.FC<RouteComponentProps> = props => {
    const [state, dispatch] = useThunkReducer(AppReducer, {
        tree: {},
        entries: { loading: true },
        settings: undefined,
        redirect: {}
    })

    const classes = useStyles()

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
            <Drawer variant="permanent" open>
                <div className={classes.sidebar}>
                    <Sidebar />
                </div>
            </Drawer>
            <div className={classes.navbar}>
                <Navbar />
            </div>
            <div className={classes.content}>
                <Switch>
                    <Route path={Routes.app.subscribe.template()} render={() => <Subscribe />} />
                    <Route path={Routes.app.feedEdit.template()} render={props => <FeedEdit feedId={props.match.params.feedId} />} />
                    <Route
                        path={Routes.app.feed.template()}
                        render={props => <FeedEntries source="feed" id={props.match.params.feedId} />}
                    />
                    <Route
                        path={Routes.app.category.template()}
                        render={props => <FeedEntries source="category" id={props.match.params.categoryId} />}
                    />
                    <Route render={() => <Redirect to={Routes.app.category.create({ categoryId: AppConstants.ALL_CATEGORY_ID })} />} />
                </Switch>
            </div>
        </AppContext.Provider>
    )
}
