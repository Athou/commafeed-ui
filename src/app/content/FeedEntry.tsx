import classNames from "classnames"
import React, { useContext, useEffect, useRef } from "react"
import Moment from "react-moment"
import { Checkbox, Divider } from "semantic-ui-react"
import { Entry } from "../../api/commafeed-api"
import { AppContext } from "../App"
import { ActionCreator } from "../AppReducer"
import styles from "./FeedEntry.module.css"

interface Props {
    entry: Entry
}

export const FeedEntry: React.FC<Props> = props => {
    const { state, dispatch } = useContext(AppContext)
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

        // TODO reusable constant somewhere
        window.scrollTo({
            top: ref.current.offsetTop - 37,
            behavior: "smooth"
        })
    }, [selected, expanded])

    return (
        <div ref={ref} className={styles.entry}>
            <div className={styles.header} onClick={() => entryHeaderClicked()}>
                <img src={props.entry.iconUrl} alt="feed icon" className={styles.icon} />
                <span
                    className={classNames({
                        [styles.title]: true,
                        [styles.titleUnread]: !props.entry.read
                    })}
                >
                    {props.entry.title}
                </span>
            </div>
            <div className={styles.meta}>
                from {props.entry.feedName} by {props.entry.author},{" "}
                <a href={props.entry.url} target="_blank" rel="noopener noreferrer" onMouseUp={() => dateClicked()}>
                    <Moment fromNow date={props.entry.date} />
                </a>
            </div>
            {expanded && (
                <>
                    <div className={styles.content}>
                        <div>
                            <div dangerouslySetInnerHTML={{ __html: props.entry.content }} />
                            <Enclosure enclosureType={props.entry.enclosureType} enclosureUrl={props.entry.enclosureUrl} />
                        </div>
                    </div>
                    <Divider />
                    <div className={styles.footer}>
                        <Checkbox label="Keep unread" onClick={() => toggleRead()} />
                    </div>
                </>
            )}
        </div>
    )
}

interface EnclosureProps {
    enclosureType?: string
    enclosureUrl?: string
}

const Enclosure: React.FC<EnclosureProps> = props => {
    const hasVideo = props.enclosureType && props.enclosureType.indexOf("video") === 0
    const hasAudio = props.enclosureType && props.enclosureType.indexOf("audio") === 0
    const hasImage = props.enclosureType && props.enclosureType.indexOf("image") === 0
    return (
        <div style={{ paddingTop: "10px" }}>
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
            {hasImage && <img src={props.enclosureUrl} alt="enclosure" style={{ maxWidth: "100%" }} />}
        </div>
    )
}
