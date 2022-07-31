import { EntrySourceType, loadEntries } from "app/slices/entries"
import { useAppDispatch, useAppSelector } from "app/store"
import { FeedEntries } from "components/content/FeedEntries"
import { useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"

interface FeedEntriesPageProps {
    sourceType: EntrySourceType
}

export function FeedEntriesPage(props: FeedEntriesPageProps) {
    const location = useLocation()
    const { id = "all" } = useParams()
    const readType = useAppSelector(state => state.user.settings?.readingMode)
    const order = useAppSelector(state => state.user.settings?.readingOrder)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!readType || !order) return
        dispatch(
            loadEntries({
                sourceType: props.sourceType,
                req: { id, readType, order },
            })
        )
    }, [dispatch, props.sourceType, id, readType, order, location.state])

    return <FeedEntries />
}
