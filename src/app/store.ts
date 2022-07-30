import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import entriesReducer from "./slices/entries"
import redirectReducer from "./slices/redirect"
import treeReducer from "./slices/tree"
import userReducer from "./slices/user"

export const store = configureStore({
    reducer: {
        entries: entriesReducer,
        redirect: redirectReducer,
        tree: treeReducer,
        user: userReducer,
    },
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
