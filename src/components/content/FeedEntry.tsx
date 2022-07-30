import { Anchor, Box, Checkbox, createStyles, Divider, Group, Image, Paper } from "@mantine/core"
import { Entry } from "app/types"
import { headerHeight } from "components/Layout"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import React, { useEffect, useRef } from "react"
import { Enclosure } from "./Enclosure"
import { FeedEntryContent } from "./FeedEntryContent"
import { Media } from "./Media"

interface FeedEntryProps {
    entry: Entry
    expanded: boolean
    onHeaderClick: (entry: Entry) => void
    onExternalLinkClick: (entry: Entry) => void
    onReadStatusCheckboxClick: (entry: Entry) => void
}

const useStyles = createStyles((theme, props: FeedEntryProps) => ({
    paper: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? props.entry.read
                    ? "inherit"
                    : theme.colors.dark[5]
                : props.entry.read && !props.expanded
                ? theme.colors.gray[0]
                : "inherit",
    },
    header: {
        cursor: "pointer",
        whiteSpace: props.expanded ? "inherit" : "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    subheader: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: "90%",
        whiteSpace: props.expanded ? "inherit" : "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    externalLink: {
        color: "inherit",
    },
    subtitle: {
        fontSize: "90%",
    },
    content: {
        maxWidth: "960px",
    },
}))

dayjs.extend(relativeTime)
export const FeedEntry: React.FC<FeedEntryProps> = props => {
    const { classes } = useStyles(props)

    // scroll to entry when expanded
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        setTimeout(() => {
            if (!ref.current) return
            if (!props.expanded) return

            window.scrollTo({
                // having a small gap between the top of the content and the top of the page is sexier
                top: ref.current.offsetTop - headerHeight - 3,
                behavior: "smooth",
            })
        })
    }, [props.expanded])

    return (
        <div ref={ref}>
            <Paper shadow="xs" p="xs" my="xs" withBorder className={classes.paper}>
                <Box className={classes.header} onClick={() => props.onHeaderClick(props.entry)}>
                    {props.entry.title}
                </Box>
                <Box className={classes.subheader} onClick={() => props.onHeaderClick(props.entry)}>
                    <Box mr={6}>
                        <Image src={props.entry.iconUrl} alt="feed icon" width={18} height={18} />
                    </Box>
                    <Box>{props.entry.feedName}</Box>
                    <Box>&nbsp;·&nbsp;</Box>
                    <Box>
                        <Anchor
                            className={classes.externalLink}
                            href={props.entry.url}
                            target="_blank"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                                props.onExternalLinkClick(props.entry)
                            }}
                            onAuxClick={(e: React.MouseEvent) => {
                                // middle click
                                if (e.button === 1) {
                                    e.stopPropagation()
                                    props.onExternalLinkClick(props.entry)
                                }
                            }}
                            rel="noreferrer"
                        >
                            {dayjs(props.entry.date).fromNow()}
                        </Anchor>
                    </Box>
                </Box>
                {props.expanded && (
                    <>
                        <Box className={classes.subtitle}>
                            {props.entry.author && <span>by {props.entry.author}</span>}
                            {props.entry.categories && <span>&nbsp;·&nbsp;{props.entry.categories}</span>}
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
                                <Checkbox
                                    checked={!props.entry.read}
                                    onChange={() => props.onReadStatusCheckboxClick(props.entry)}
                                    label="Keep unread"
                                />
                            </Group>
                        </Box>
                    </>
                )}
            </Paper>
        </div>
    )
}
