import React, { useContext, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroller"
import { Loader } from "semantic-ui-react"
import { AppContext } from "../App"
import { ActionCreator, EntrySource } from "../AppReducer"
import styles from "./FeedEntries.module.css"
import { FeedEntry } from "./FeedEntry"

interface Props {
    id: string
    source: EntrySource
}

export const FeedEntries: React.FC<Props> = props => {
    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
        dispatch(ActionCreator.entries.setSource(props.id, props.source))
        window.scrollTo(0, 0)
    }, [dispatch, props.id, props.source])

    useEffect(() => {
        function keyPressed(e: KeyboardEvent) {
            if (e.key === " ") {
                e.preventDefault()
                if (e.shiftKey) dispatch(ActionCreator.entries.selectPreviousEntry())
                else dispatch(ActionCreator.entries.selectNextEntry())
            }
        }

        window.addEventListener("keydown", keyPressed)
        return () => window.removeEventListener("keydown", keyPressed)
    }, [dispatch])

    if (!state.entries.label || !state.entries.entries) return null

    function loadMoreEntries(page: number) {
        dispatch(ActionCreator.entries.loadMore())
    }

    return (
        <>
            {state.entries.loading && <Loader active>Loading</Loader>}
            {!state.entries.loading && (
                <div className={styles.content}>
                    <InfiniteScroll
                        initialLoad={false}
                        loadMore={page => loadMoreEntries(page)}
                        hasMore={state.entries.hasMore}
                        loader={
                            <div className="loader" key={0}>
                                Loading ...
                            </div>
                        }
                    >
                        {state.entries.entries.map(e => (
                            <FeedEntry entry={e} key={e.id} />
                        ))}
                    </InfiniteScroll>
                </div>
            )}
        </>
    )
}
