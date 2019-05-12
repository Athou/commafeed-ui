import { Dispatch, Reducer, useCallback, useRef, useState } from "react"

export interface Thunk<S, A> {
    (dispatch: Dispatch<A | Thunk<S, A>>, getState: () => S): void
}

// adapted from https://github.com/nathanbuchar/react-hook-thunk-reducer
export function useThunkReducer<S, A>(reducer: Reducer<S, A>, initialArg: S): [S, Dispatch<A | Thunk<S, A>>] {
    const [hookState, setHookState] = useState(initialArg)

    const state = useRef(hookState)
    const getState = useCallback(() => state.current, [])
    const setState = useCallback(newState => {
        state.current = newState
        setHookState(newState)
    }, [])

    const reduce = useCallback(action => reducer(getState(), action), [reducer, getState])
    const dispatch: Dispatch<A | Thunk<S, A>> = useCallback(
        (action: A | Thunk<S, A>) => {
            if (typeof action === "function") {
                const thunk: Thunk<S, A> = action as Thunk<S, A>
                thunk(dispatch, getState)
            } else {
                setState(reduce(action))
            }
        },
        [getState, setState, reduce]
    )

    return [hookState, dispatch]
}
