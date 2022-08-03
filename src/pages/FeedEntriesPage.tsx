import { ActionIcon, Group, Title } from "@mantine/core"
import { EntrySourceType, loadEntries } from "app/slices/entries"
import { redirectToCategoryDetails, redirectToFeedDetails } from "app/slices/redirect"
import { useAppDispatch, useAppSelector } from "app/store"
import { FeedEntries } from "components/content/FeedEntries"
import { useAppTheme } from "hooks/useAppTheme"
import { useEffect } from "react"
import { TbEdit } from "react-icons/tb"
import { useLocation, useParams } from "react-router-dom"

interface FeedEntriesPageProps {
    sourceType: EntrySourceType
}

export function FeedEntriesPage(props: FeedEntriesPageProps) {
    const location = useLocation()
    const { id = "all" } = useParams()
    const theme = useAppTheme()
    const sourceLabel = useAppSelector(state => state.entries.sourceLabel)
    const readType = useAppSelector(state => state.user.settings?.readingMode)
    const order = useAppSelector(state => state.user.settings?.readingOrder)
    const dispatch = useAppDispatch()

    const titleClicked = () => {
        if (props.sourceType === "category") dispatch(redirectToCategoryDetails(id))
        else dispatch(redirectToFeedDetails(id))
    }

    useEffect(() => {
        if (!readType || !order) return
        dispatch(
            loadEntries({
                sourceType: props.sourceType,
                req: { id, readType, order },
            })
        )
    }, [dispatch, props.sourceType, id, readType, order, location.state])

    const hideEditButton = props.sourceType === "category" && id === "all"
    return (
        <>
            <Group spacing="xl">
                <Title order={3}>{sourceLabel}</Title>
                {!hideEditButton && (
                    <ActionIcon onClick={titleClicked} variant="subtle" color={theme.primaryColor}>
                        <TbEdit size={18} />
                    </ActionIcon>
                )}
            </Group>

            <FeedEntries />
        </>
    )
}
