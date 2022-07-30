import { Box, Image } from "@mantine/core"
import { FeedEntryContent } from "./FeedEntryContent"

export interface MediaProps {
    thumbnailUrl: string
    thumbnailWidth?: number
    thumbnailHeight?: number
    description?: string
}

export const Media = (props: MediaProps) => {
    return (
        <>
            <Image src={props.thumbnailUrl} width={props.thumbnailWidth} height={props.thumbnailHeight} alt="thumbnail" />
            {props.description && (
                <Box pt="md">
                    <FeedEntryContent content={props.description}></FeedEntryContent>
                </Box>
            )}
        </>
    )
}
