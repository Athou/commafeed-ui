import { Box, Checkbox, createStyles, Divider, Group, Image, Paper, Text } from "@mantine/core"
import { markEntry, selectEntry } from "app/slices/entries"
import { useAppDispatch } from "app/store"
import { Entry } from "app/types"
import { ActionButton } from "components/ActionButtton"
import { RelativeDate } from "components/RelativeDate"
import { useAppTheme } from "hooks/useAppTheme"
import React, { useEffect, useRef } from "react"
import { TbExternalLink } from "react-icons/tb"
import { Enclosure } from "./Enclosure"
import { FeedEntryContent } from "./FeedEntryContent"
import { Media } from "./Media"

interface FeedEntryProps {
    entry: Entry
    expanded: boolean
}

const useStyles = createStyles((theme, props: FeedEntryProps) => {
    let backgroundColor
    if (theme.colorScheme === "dark") backgroundColor = props.entry.read ? "inherit" : theme.colors.dark[5]
    else backgroundColor = props.entry.read && !props.expanded ? theme.colors.gray[0] : "inherit"

    return {
        paper: {
            backgroundColor,
        },
        header: {
            color: "inherit",
            textDecoration: "inherit",
            cursor: "pointer",
        },
        headerText: {
            fontWeight: theme.colorScheme === "light" && !props.entry.read ? "bold" : "inherit",
            whiteSpace: props.expanded ? "inherit" : "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
        headerSubtext: {
            display: "flex",
            alignItems: "center",
            fontSize: "90%",
            whiteSpace: props.expanded ? "inherit" : "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
        subtitle: {
            fontSize: "90%",
        },
        content: {
            maxWidth: "960px",
        },
    }
})

export function FeedEntry(props: FeedEntryProps) {
    const { classes } = useStyles(props)
    const theme = useAppTheme()
    const dispatch = useAppDispatch()

    const headerClicked = (e: React.MouseEvent) => {
        if (e.button === 0) {
            // main click
            // don't trigger the link
            e.preventDefault()

            dispatch(selectEntry(props.entry))
        } else if (e.button === 1) {
            // middle click
            dispatch(markEntry({ entry: props.entry, read: true }))
        }
    }

    const readStatusCheckboxClicked = () => dispatch(markEntry({ entry: props.entry, read: !props.entry.read }))

    // scroll to entry when expanded
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        setTimeout(() => {
            if (!ref.current) return
            if (!props.expanded) return

            window.scrollTo({
                // having a small gap between the top of the content and the top of the page is sexier
                top: ref.current.offsetTop - theme.layout.headerHeight - 3,
                behavior: "smooth",
            })
        })
    }, [props.expanded, theme.layout.headerHeight])

    return (
        <div ref={ref}>
            <Paper shadow="xs" p="xs" my="xs" withBorder className={classes.paper}>
                <a
                    href={props.entry.url}
                    target="_blank"
                    rel="noreferrer"
                    className={classes.header}
                    onClick={headerClicked}
                    onAuxClick={headerClicked}
                >
                    <Box className={classes.headerText}>{props.entry.title}</Box>
                    <Box className={classes.headerSubtext}>
                        <Box mr={6}>
                            <Image src={props.entry.iconUrl} alt="feed icon" width={18} height={18} />
                        </Box>
                        <Box>
                            <Text color="dimmed">{props.entry.feedName}</Text>
                        </Box>
                        <Box>
                            <Text color="dimmed">
                                <span>&nbsp;·&nbsp;</span>
                                <RelativeDate date={props.entry.date} />
                            </Text>
                        </Box>
                    </Box>
                </a>
                {props.expanded && (
                    <>
                        <Box className={classes.subtitle}>
                            <Text color="dimmed">
                                {props.entry.author && <span>by {props.entry.author}</span>}
                                {props.entry.author && props.entry.categories && <span>&nbsp;·&nbsp;</span>}
                                {props.entry.categories && <span>{props.entry.categories}</span>}
                            </Text>
                        </Box>
                        <Box className={classes.content}>
                            <Box mt="md">
                                <FeedEntryContent content={props.entry.content} />
                            </Box>
                            {props.entry.enclosureUrl && (
                                <Box pt="md">
                                    <Enclosure enclosureType={props.entry.enclosureType} enclosureUrl={props.entry.enclosureUrl} />
                                </Box>
                            )}
                            {!props.entry.content && props.entry.mediaThumbnailUrl && (
                                <Box pt="md">
                                    <Media
                                        thumbnailUrl={props.entry.mediaThumbnailUrl}
                                        thumbnailWidth={props.entry.mediaThumbnailWidth}
                                        thumbnailHeight={props.entry.mediaThumbnailHeight}
                                        description={props.entry.mediaDescription}
                                    />
                                </Box>
                            )}
                            <Divider variant="dashed" mt="md" mb="md" />
                            <Group>
                                {props.entry.markable && (
                                    <Checkbox
                                        label="Keep unread"
                                        checked={!props.entry.read}
                                        onClick={readStatusCheckboxClicked}
                                        styles={{
                                            label: { cursor: "pointer" },
                                            input: { cursor: "pointer" },
                                        }}
                                    />
                                )}
                                <a href={props.entry.url} target="_blank" rel="noreferrer">
                                    <ActionButton icon={<TbExternalLink size={18} />} label="Open link" />
                                </a>
                            </Group>
                        </Box>
                    </>
                )}
            </Paper>
        </div>
    )
}
