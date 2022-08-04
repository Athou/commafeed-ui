import { Anchor, Box, createStyles, Divider, Paper } from "@mantine/core"
import { markEntry, selectEntry } from "app/slices/entries"
import { useAppDispatch } from "app/store"
import { Entry } from "app/types"
import { useAppTheme } from "hooks/useAppTheme"
import React, { useEffect, useRef } from "react"
import { FeedEntryBody } from "./FeedEntryBody"
import { FeedEntryFooter } from "./FeedEntryFooter"
import { FeedEntryHeader } from "./FeedEntryHeader"

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
        body: {
            maxWidth: "960px",
        },
    }
})

export function FeedEntry(props: FeedEntryProps) {
    const { classes } = useStyles(props)
    const theme = useAppTheme()
    const dispatch = useAppDispatch()

    const headerClicked = (e: React.MouseEvent) => {
        if (e.button === 1 || e.ctrlKey || e.metaKey) {
            // middle click
            dispatch(markEntry({ entry: props.entry, read: true }))
        } else if (e.button === 0) {
            // main click
            // don't trigger the link
            e.preventDefault()

            dispatch(selectEntry(props.entry))
        }
    }

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
                <Anchor
                    variant="text"
                    href={props.entry.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={headerClicked}
                    onAuxClick={headerClicked}
                >
                    <FeedEntryHeader entry={props.entry} expanded={props.expanded} />
                </Anchor>
                {props.expanded && (
                    <Box mt="md">
                        <Box className={classes.body}>
                            <FeedEntryBody entry={props.entry} />
                        </Box>
                        <Divider variant="dashed" my="md" />
                        <FeedEntryFooter entry={props.entry} />
                    </Box>
                )}
            </Paper>
        </div>
    )
}
