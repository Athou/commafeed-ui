import { Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { History } from "history";
import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import Tinycon from "tinycon";
import { categoryUnreadCount } from "../api/utils";
import { Routes } from "../Routes";
import { AppConstants } from "./AppConstants";
import { ActionCreator, Actions, AppReducer, State } from "./AppReducer";
import { FeedEdit } from "./content/FeedEdit";
import { FeedEntries } from "./content/FeedEntries";
import { Subscribe } from "./content/Subscribe";
import { Navbar } from "./navbar/Navbar";
import { Sidebar } from "./sidebar/Sidebar";

const useStyles = makeStyles(theme => ({
  sidebar: {
    width: AppConstants.SIDEBAR_WIDTH,
    height: "100%",
    overflow: "hidden",
    "&:hover": {
      overflow: "auto"
    }
  },
  content: {
    marginLeft: AppConstants.SIDEBAR_WIDTH,
    paddingTop: AppConstants.NAVBAR_HEIGHT
  }
}));

const thunkMiddleware: ThunkMiddleware<State, Actions> = thunk;
const store = createStore(AppReducer, applyMiddleware(thunkMiddleware));
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export const App: React.FC<RouteComponentProps> = props => {
  const classes = useStyles();

  // load initial data
  useEffect(() => {
    store.dispatch(ActionCreator.settings.reload());
  }, []);

  return (
    <Provider store={store}>
      <FaviconHandler />
      <RedirectHandler history={props.history} />
      <Drawer variant="permanent" open>
        <div className={classes.sidebar}>
          <Sidebar />
        </div>
      </Drawer>
      <Navbar />
      <div className={classes.content}>
        <Switch>
          <Route
            path={Routes.app.subscribe.template()}
            render={() => <Subscribe />}
          />
          <Route
            path={Routes.app.feedEdit.template()}
            render={props => <FeedEdit feedId={props.match.params.feedId} />}
          />
          <Route
            path={Routes.app.feed.template()}
            render={props => (
              <FeedEntries source="feed" id={props.match.params.feedId} />
            )}
          />
          <Route
            path={Routes.app.category.template()}
            render={props => (
              <FeedEntries
                source="category"
                id={props.match.params.categoryId}
              />
            )}
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
  );
};

const FaviconHandler: React.FC = () => {
  const root = useSelector((state: State) => state.tree.root);
  useEffect(() => {
    const unreadCount = categoryUnreadCount(root);
    Tinycon.setBubble(unreadCount);
  }, [root]);

  return null;
};

const RedirectHandler: React.FC<{ history: History }> = props => {
  const redirectTo = useSelector((state: State) => state.redirect.redirectTo);
  useEffect(() => {
    if (redirectTo) props.history.push(redirectTo);
  }, [redirectTo, props.history]);

  return null;
};
