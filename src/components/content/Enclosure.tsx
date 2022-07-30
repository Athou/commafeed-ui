import { createStyles, Image } from "@mantine/core"

const useStyles = createStyles(() => ({
    enclosureImage: {
        maxWidth: "50%",
    },
}))

export const Enclosure: React.FC<{
    enclosureType?: string
    enclosureUrl?: string
}> = props => {
    const { classes } = useStyles()
    const hasVideo = props.enclosureType && props.enclosureType.indexOf("video") === 0
    const hasAudio = props.enclosureType && props.enclosureType.indexOf("audio") === 0
    const hasImage = props.enclosureType && props.enclosureType.indexOf("image") === 0
    return (
        <>
            {hasVideo && (
                <video controls>
                    <source src={props.enclosureUrl} type={props.enclosureType} />
                </video>
            )}
            {hasAudio && (
                <audio controls>
                    <source src={props.enclosureUrl} type={props.enclosureType} />
                </audio>
            )}
            {hasImage && <Image src={props.enclosureUrl} alt="enclosure" className={classes.enclosureImage} />}
        </>
    )
}
