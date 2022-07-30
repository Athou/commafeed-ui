import { Box, createStyles } from "@mantine/core"
import { FeedEntryContent } from "./FeedEntryContent"

export interface MediaProps {
    thumbnailUrl: string
    thumbnailWidth?: number
    thumbnailHeight?: number
    description?: string
}

const useStyles = createStyles(() => ({
    image: {
        maxWidth: "100%",
        height: "auto",
    },
}))

export const Media = (props: MediaProps) => {
    const { classes } = useStyles()
    return (
        <>
            <img
                className={classes.image}
                src={props.thumbnailUrl}
                width={props.thumbnailWidth}
                height={props.thumbnailHeight}
                alt="media thumbnail"
            />
            {props.description && (
                <Box pt="md">
                    <FeedEntryContent content={props.description}></FeedEntryContent>
                </Box>
            )}
        </>
    )
}