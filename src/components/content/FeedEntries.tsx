import { Title } from "@mantine/core"
import {
    loadMoreEntries,
    markAllEntries,
    markEntry,
    reloadEntries,
    selectEntry,
    selectNextEntry,
    selectPreviousEntry,
} from "app/slices/entries"
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
    const entriesTimestamp = useAppSelector(state => state.entries.timestamp)
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

    useHotkeys("r", () => {
        dispatch(reloadEntries())
    })
    useHotkeys("j", () => {
        dispatch(selectNextEntry())
    })
    useHotkeys("k", () => {
        dispatch(selectPreviousEntry())
    })
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
    useHotkeys(
        "o, enter",
        () => {
            // toggle expanded status
            if (!selectedEntry) return
            dispatch(selectEntry(selectedEntry))
        },
        [selectedEntry]
    )
    useHotkeys(
        "v",
        () => {
            // open tab in foreground
            if (!selectedEntry) return
            window.open(selectedEntry.url, "_blank", "noreferrer")
        },
        [selectedEntry]
    )
    useHotkeys(
        "b",
        () => {
            // simulate ctrl+click to open tab in background
            if (!selectedEntry) return
            const a = document.createElement("a")
            a.href = selectedEntry.url
            a.rel = "noreferrer"
            a.dispatchEvent(
                new MouseEvent("click", {
                    ctrlKey: true,
                    metaKey: true,
                })
            )
        },
        [selectedEntry]
    )
    useHotkeys(
        "m",
        () => {
            // toggle read status
            if (!selectedEntry) return
            dispatch(markEntry({ entry: selectedEntry, read: !selectedEntry.read }))
        },
        [selectedEntry]
    )
    useHotkeys(
        "shift+a",
        () => {
            // mark all entries as read
            dispatch(
                markAllEntries({
                    sourceType: source.type,
                    req: {
                        id: source.id,
                        read: true,
                        olderThan: entriesTimestamp,
                    },
                })
            )
        },
        [selectedEntry, source.type, source.id, entriesTimestamp]
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
