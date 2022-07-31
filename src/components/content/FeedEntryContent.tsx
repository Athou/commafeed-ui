import { createStyles, Text } from "@mantine/core"

export interface FeedEntryContentProps {
    content: string
}

const useStyles = createStyles(theme => ({
    content: {
        "& a": {
            color: theme.primaryColor,
        },
        "& img": {
            maxWidth: "100%",
            height: "auto",
        },
        "& iframe": {
            maxWidth: "100%",
        },
    },
}))

export function FeedEntryContent(props: FeedEntryContentProps) {
    const { classes } = useStyles()
    return <Text size="md" className={classes.content} dangerouslySetInnerHTML={{ __html: props.content }} />
}
