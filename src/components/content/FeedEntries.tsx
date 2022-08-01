import { Title } from "@mantine/core"
import { loadMoreEntries, selectNextEntry, selectPreviousEntry } from "app/slices/entries"
import { useAppDispatch, useAppSelector } from "app/store"
import { headerHeight } from "components/Layout"
import { Loader } from "components/Loader"
import { useEffect, useRef } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import InfiniteScroll from "react-infinite-scroller"
import { FeedEntry } from "./FeedEntry"

export function FeedEntries() {
    const source = useAppSelector(state => state.entries.source)
    const sourceLabel = useAppSelector(state => state.entries.sourceLabel)
    const entries = useAppSelector(state => state.entries.entries)
    const selectedEntryId = useAppSelector(state => state.entries.selectedEntryId)
    const hasMore = useAppSelector(state => state.entries.hasMore)
    const dispatch = useAppDispatch()

    const selectedEntry = entries.find(e => e.id === selectedEntryId)

    useEffect(() => {
        // scroll back to top when source changed
        window.scrollTo(0, 0)
    }, [source])

    // references to entries html elements
    const refs = useRef<{ [id: string]: HTMLDivElement }>({})
    useEffect(() => {
        // remove refs that are not in entries anymore
        Object.keys(refs.current).forEach(k => {
            const found = entries.some(e => e.id === k)
            if (!found) delete refs.current[k]
        })
    }, [entries])

    useHotkeys(
        "space",
        () => {
            // select next entry only if the bottom of the entry is visible, otherwise keep scrolling
            if (selectedEntry?.expanded) {
                const ref = refs.current[selectedEntry.id]
                const bottomVisible = ref.getBoundingClientRect().bottom <= window.innerHeight
                if (!bottomVisible) return
            }
            dispatch(selectNextEntry())
        },
        [selectedEntry]
    )
    useHotkeys(
        "shift+space",
        () => {
            // select previous entry only if the top of the entry is visible, otherwise keep scrolling
            if (selectedEntry?.expanded) {
                const ref = refs.current[selectedEntry.id]
                const topVisible = ref.getBoundingClientRect().top >= headerHeight
                if (!topVisible) return
            }
            dispatch(selectPreviousEntry())
        },
        [selectedEntry]
    )

    if (!entries) return <Loader />
    return (
        <>
            <Title order={3}>{sourceLabel}</Title>
            <InfiniteScroll initialLoad={false} loadMore={() => dispatch(loadMoreEntries())} hasMore={hasMore} loader={<Loader key={0} />}>
                {entries.map(e => (
                    <div
                        key={e.id}
                        ref={el => {
                            refs.current[e.id] = el!
                        }}
                    >
                        <FeedEntry entry={e} expanded={!!e.expanded} />
                    </div>
                ))}
            </InfiniteScroll>
        </>
    )
}
