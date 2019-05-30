import { Box, Checkbox, createStyles, Divider, FormControlLabel, Link, makeStyles, Paper, Typography } from "@material-ui/core"
import React, { useContext, useEffect, useRef } from "react"
import Moment from "react-moment"
import { Entry } from "../../api/commafeed-api"
import { AppContext } from "../App"
import { AppConstants } from "../AppConstants"
import { ActionCreator } from "../AppReducer"

const useStyles = makeStyles(theme =>
    createStyles({
        header: {
            display: "flex",
            alignItems: "center",
            cursor: "pointer"
        },
        icon: {
            width: "24px",
            height: "24px",
            marginRight: "0.5em"
        },
        content: {
            marginTop: "0.5em",
            "& a": {
                color: theme.palette.action.active
            }
        },
        enclosure: {
            paddingTop: "10px"
        },
        enclosureImage: {
            maxWidth: "50%"
        }
    })
)

export const FeedEntry: React.FC<{ entry: Entry }> = props => {
    const { state, dispatch } = useContext(AppContext)
    const classes = useStyles()
    const ref = useRef<HTMLDivElement>(null)

    const selected = state.entries.selectedEntryId === props.entry.id
    const expanded = selected && state.entries.selectedEntryExpanded

    function entryHeaderClicked() {
        dispatch(ActionCreator.entries.selectEntry(props.entry, !expanded))
    }

    function toggleRead() {
        dispatch(ActionCreator.entries.markAsRead(props.entry.id, +props.entry.feedId, !props.entry.read))
    }

    function dateClicked() {
        if (!props.entry.read) toggleRead()
    }

    // scroll to entry when expanded
    useEffect(() => {
        if (!ref.current) return
        if (!selected || !expanded) return

        window.scrollTo({
            top: ref.current.offsetTop - AppConstants.NAVBAR_HEIGHT - 3,
            behavior: "smooth"
        })
    }, [selected, expanded])

    return (
        <div ref={ref}>
            <Paper>
                <Box m={1} p={1}>
                    <Typography
                        variant="h6"
                        color={props.entry.read ? "textSecondary" : "textPrimary"}
                        className={classes.header}
                        onClick={() => entryHeaderClicked()}
                    >
                        <img src={props.entry.iconUrl} alt="feed icon" className={classes.icon} />
                        {props.entry.title}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        from {props.entry.feedName} by {props.entry.author},{" "}
                        <Link
                            href={props.entry.url}
                            color="inherit"
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseUp={() => dateClicked()}
                        >
                            <Moment fromNow date={props.entry.date} />
                        </Link>
                    </Typography>
                    {expanded && (
                        <>
                            <Typography
                                variant="body1"
                                color="textPrimary"
                                className={classes.content}
                                dangerouslySetInnerHTML={{ __html: props.entry.content }}
                            />
                            <Enclosure enclosureType={props.entry.enclosureType} enclosureUrl={props.entry.enclosureUrl} />
                            <Divider light />
                            <Typography variant="body2" color="textSecondary">
                                <FormControlLabel control={<Checkbox onChange={() => toggleRead()} />} label="Keep unread" />
                            </Typography>
                        </>
                    )}
                </Box>
            </Paper>
        </div>
    )
}

const Enclosure: React.FC<{
    enclosureType?: string
    enclosureUrl?: string
}> = props => {
    const classes = useStyles()

    const hasVideo = props.enclosureType && props.enclosureType.indexOf("video") === 0
    const hasAudio = props.enclosureType && props.enclosureType.indexOf("audio") === 0
    const hasImage = props.enclosureType && props.enclosureType.indexOf("image") === 0
    return (
        <div className={classes.enclosure}>
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
            {hasImage && <img src={props.enclosureUrl} alt="enclosure" className={classes.enclosureImage} />}
        </div>
    )
}
