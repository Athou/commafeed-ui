import React, { Dispatch, Reducer, useEffect, useReducer } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Clients } from '..';
import { Category, Entry, ReadingMode, ReadingOrder } from '../commafeed-api';
import styles from './App.module.css';
import { FeedEdit } from './content/FeedEdit';
import { FeedEntries } from './content/FeedEntries';
import { Navbar } from './navbar/Navbar';
import { Sidebar } from './sidebar/Sidebar';

interface TreeState {
  root?: Category
}

interface EntriesState {
  entries?: Entry[],
  label?: string
}

interface SettingsState {
  readingMode?: ReadingMode,
  readingOrder?: ReadingOrder
}

interface RedirectState {
  redirectTo?: string
}

interface State {
  tree: TreeState,
  entries: EntriesState,
  settings: SettingsState,
  redirect: RedirectState,
}

export type Actions =
  | { type: "tree.setRoot", root: Category }
  | { type: "entries.setEntries", entries: Entry[], label: string }
  | { type: "entries.setRead", id: string, read: boolean }
  | { type: "settings.setReadingMode", readingMode: ReadingMode }
  | { type: "settings.setReadingOrder", readingOrder: ReadingOrder }
  | { type: "navigateToCategoryEntries", categoryId: string }
  | { type: "navigateToFeedEntries", feedId: number }

export const AppContext = React.createContext({} as { state: State, dispatch: Dispatch<Actions> })

export const App: React.FC<RouteComponentProps> = props => {

  const treeReducer: Reducer<TreeState, Actions> = (state, action) => {
    switch (action.type) {
      case "tree.setRoot":
        return { ...state, root: action.root }
      default:
        return state
    }
  }

  const entriesReducer: Reducer<EntriesState, Actions> = (state, action) => {
    switch (action.type) {
      case "entries.setEntries":
        return { ...state, entries: action.entries, label: action.label }
      case "entries.setRead":
        const newEntries = state.entries ?
          state.entries.map(e => e.id === action.id ? Object.assign({}, e, { read: action.read }) : e) :
          undefined
        return { ...state, entries: newEntries }
      default:
        return state
    }
  }

  const settingsReducer: Reducer<SettingsState, Actions> = (state, action) => {
    switch (action.type) {
      case "settings.setReadingMode":
        return { ...state, readingMode: action.readingMode }
      case "settings.setReadingOrder":
        return { ...state, readingOrder: action.readingOrder }
      default:
        return state
    }
  }

  const redirectReducer: Reducer<RedirectState, Actions> = (state, action) => {
    switch (action.type) {
      case "navigateToCategoryEntries":
        return { ...state, redirectTo: `${props.match.url}/category/${action.categoryId}` }
      case "navigateToFeedEntries":
        return { ...state, redirectTo: `${props.match.url}/feed/${action.feedId}` }
      default:
        return state
    }
  }

  const reducer: Reducer<State, Actions> = (state, action) => {
    return {
      ...state,
      tree: treeReducer(state.tree, action),
      entries: entriesReducer(state.entries, action),
      settings: settingsReducer(state.settings, action),
      redirect: redirectReducer(state.redirect, action)
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    tree: {},
    entries: {},
    settings: {},
    redirect: {}
  })

  // load initial data
  useEffect(() => {
    Clients.category.get()
      .then(root => dispatch({ type: "tree.setRoot", root }))

    Clients.user.settingsGet()
      .then(settings => {
        dispatch({ type: "settings.setReadingMode", readingMode: settings.readingMode })
        dispatch({ type: "settings.setReadingOrder", readingOrder: settings.readingOrder })
      })
  }, [])


  // handle redirect
  useEffect(() => {
    if (state.redirect.redirectTo)
      props.history.push(state.redirect.redirectTo)
  }, [state.redirect.redirectTo, props.history])

  return (
    <AppContext.Provider value={{ state: state, dispatch: dispatch }}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Switch>
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
