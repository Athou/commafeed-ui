import { Title } from "@mantine/core"
import { loadMoreEntries, markEntry, selectEntry } from "app/slices/entries"
import { useAppDispatch, useAppSelector } from "app/store"
import { Entry } from "app/types"
import { Loader } from "components/Loader"
import { useEffect } from "react"
import InfiniteScroll from "react-infinite-scroller"
import { FeedEntry } from "./FeedEntry"

export const FeedEntries = () => {
    const source = useAppSelector(state => state.entries.source)
    const sourceLabel = useAppSelector(state => state.entries.sourceLabel)
    const entries = useAppSelector(state => state.entries.entries)
    const selectedEntryId = useAppSelector(state => state.entries.selectedEntryId)
    const hasMore = useAppSelector(state => state.entries.hasMore)
    const dispatch = useAppDispatch()

    useEffect(() => {
        // scroll back to top when source changed
        window.scrollTo(0, 0)
    }, [dispatch, source])

    const loadMore = () => dispatch(loadMoreEntries())
    const entryHeaderClicked = (entry: Entry) => dispatch(selectEntry(entry))
    const entryExternalLinkClicked = (entry: Entry) => !entry.read && dispatch(markEntry({ entry, read: true }))
    const entryReadStatusCheckboxClicked = (entry: Entry) => dispatch(markEntry({ entry, read: !entry.read }))

    if (!entries) return <Loader />
    return (
        <>
            <Title order={3}>{sourceLabel}</Title>
            <InfiniteScroll initialLoad={false} loadMore={loadMore} hasMore={hasMore} loader={<Loader key={0} />}>
                {entries.map(e => (
                    <FeedEntry
                        entry={e}
                        expanded={e.id === selectedEntryId && !!e.expanded}
                        onHeaderClick={entryHeaderClicked}
                        onExternalLinkClick={entryExternalLinkClicked}
                        onReadStatusCheckboxClick={entryReadStatusCheckboxClicked}
                        key={e.id}
                    />
                ))}
            </InfiniteScroll>
        </>
    )
}
