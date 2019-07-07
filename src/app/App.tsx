import { Divider, Drawer, Hidden, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { ChevronLeft } from "@material-ui/icons"
import { History } from "history"
import React, { useEffect } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import thunk, { ThunkMiddleware } from "redux-thunk"
import Tinycon from "tinycon"
import { categoryUnreadCount } from "../api/utils"
import { Routes } from "../Routes"
import { AppConstants } from "./AppConstants"
import { ActionCreator, Actions, AppReducer, State } from "./AppReducer"
import { FeedEdit } from "./content/FeedEdit"
import { FeedEntries } from "./content/FeedEntries"
import { Subscribe } from "./content/Subscribe"
import { Navbar } from "./navbar/Navbar"
import { Tree } from "./sidebar/Tree"

const useStyles = makeStyles(theme => ({
    sidebar: {
        width: AppConstants.SIDEBAR_WIDTH,
        height: "100%",
        overflow: "hidden",
        "&:hover": {
            overflow: "auto"
        }
    },
    sidebarHeader: {
        height: AppConstants.NAVBAR_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    content: {
        paddingTop: AppConstants.NAVBAR_HEIGHT,
        [theme.breakpoints.up("sm")]: {
            marginLeft: AppConstants.SIDEBAR_WIDTH
        }
    }
}))

const thunkMiddleware: ThunkMiddleware<State, Actions> = thunk
const store = createStore(AppReducer, applyMiddleware(thunkMiddleware))
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()

export const App: React.FC<RouteComponentProps> = props => {
    const classes = useStyles()

    // load initial data
    useEffect(() => {
        store.dispatch(ActionCreator.settings.reload())
    }, [])

    return (
        <Provider store={store}>
            <FaviconHandler />
            <RedirectHandler history={props.history} />
            <Sidebar />
            <Navbar />
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
                    <Route
                        render={() => (
                            <Redirect
                                to={Routes.app.category.create({
                                    categoryId: AppConstants.ALL_CATEGORY_ID
                                })}
                            />
                        )}
                    />
                </Switch>
            </div>
        </Provider>
    )
}

const FaviconHandler: React.FC = () => {
    const root = useSelector((state: State) => state.tree.root)
    useEffect(() => {
        const unreadCount = categoryUnreadCount(root)
        Tinycon.setBubble(unreadCount)
    }, [root])

    return null
}

const RedirectHandler: React.FC<{ history: History }> = props => {
    const redirectTo = useSelector((state: State) => state.redirect.redirectTo)
    useEffect(() => {
        if (redirectTo) props.history.push(redirectTo)
    }, [redirectTo, props.history])

    return null
}

const Sidebar: React.FC = () => {
    const visible = useSelector((state: State) => state.tree.visible)
    const dispatch = useAppDispatch()
    const classes = useStyles()

    const closeMenuClicked = () => dispatch(ActionCreator.tree.toggleVisibility())

    return (
        <>
            <Hidden smUp>
                <Drawer variant="temporary" open={visible} onClose={closeMenuClicked}>
                    <div className={classes.sidebar}>
                        <div className={classes.sidebarHeader}>
                            <IconButton onClick={closeMenuClicked}>
                                <ChevronLeft />
                            </IconButton>
                        </div>
                        <Divider />
                        <Tree />
                    </div>
                </Drawer>
            </Hidden>
            <Hidden xsDown>
                <Drawer variant="persistent" open>
                    <div className={classes.sidebarHeader} />
                    <div className={classes.sidebar}>
                        <Divider />
                        <Tree />
                    </div>
                </Drawer>
            </Hidden>
        </>
    )
}
