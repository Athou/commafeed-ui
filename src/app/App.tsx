import React, { Dispatch, useEffect, useMemo, useReducer } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import styles from './App.module.css';
import { AppController } from './AppController';
import { Actions, AppReducer, State } from './AppReducer';
import { FeedEdit } from './content/FeedEdit';
import { FeedEntries } from './content/FeedEntries';
import { Subscribe } from './content/Subscribe';
import { Navbar } from './navbar/Navbar';
import { Sidebar } from './sidebar/Sidebar';

export const AppContext = React.createContext({} as { state: State, dispatch: Dispatch<Actions>, controller: AppController })

export const App: React.FC<RouteComponentProps> = props => {

  const [state, dispatch] = useReducer(AppReducer, {
    tree: {},
    entries: { loading: true },
    settings: {},
    redirect: {}
  })
  const controller = useMemo(() => new AppController(dispatch), [])

  // load initial data
  useEffect(() => {
    controller.reloadTree()
    controller.reloadSettings()
  }, [controller])

  useEffect(() => {
    if (!state.entries.id || !state.entries.source || !state.settings.readingMode || !state.settings.readingOrder)
      return

    controller.reloadEntries(state.entries.id, state.entries.source, state.settings.readingMode, state.settings.readingOrder)
  }, [controller, state.entries.id, state.entries.source, state.settings.readingMode, state.settings.readingOrder])

  // handle redirect
  useEffect(() => {
    if (state.redirect.redirectTo)
      props.history.push(state.redirect.redirectTo)
  }, [state.redirect.redirectTo, props.history])

  return (
    <AppContext.Provider value={{ state, dispatch, controller }}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Switch>
          <Route path={`${props.match.url}/subscribe`}
            render={() => <Subscribe />} />

          <Route path={`${props.match.url}/feed/:feedId/edit`}
            render={props => <FeedEdit feedId={props.match.params.feedId} />} />

          <Route path={`${props.match.url}/feed/:feedId`}
            render={props => <FeedEntries source="feed" id={props.match.params.feedId} />} />

          <Route path={`${props.match.url}/category/:categoryId`}
            render={props => <FeedEntries source="category" id={props.match.params.categoryId} />} />

          <Route render={() => <Redirect to={`${props.match.url}/category/all`} />} />
        </Switch>
      </div>
    </AppContext.Provider>
  )
}
