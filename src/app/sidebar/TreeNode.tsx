import classNames from "classnames"
import React, { useContext } from "react"
import { Subscription } from "../../commafeed-api"
import { AppContext } from "../App"
import { ActionCreator } from "../AppReducer"
import styles from "./Tree.module.css"
import { UnreadCount } from "./UnreadCount"

interface Props {
    subscription: Subscription
}

export const TreeNode: React.FC<Props> = props => {
    const { state, dispatch } = useContext(AppContext)

    const selected = state.entries.source === "feed" && state.entries.id === String(props.subscription.id)
    const unread = props.subscription.unread

    return (
        <div
            style={{
                paddingTop: "1px",
                paddingBottom: "1px"
            }}
            className={classNames({
                [styles.node]: true,
                [styles.unread]: unread,
                [styles.selected]: selected
            })}
            onClick={() => dispatch(ActionCreator.redirect.navigateToFeed(props.subscription.id))}
        >
            <img
                src={props.subscription.iconUrl}
                alt="favicon"
                style={{
                    width: "16px",
                    height: "16px",
                    marginRight: "5px",
                    position: "relative",
                    top: "4px"
                }}
            />
            {props.subscription.name}
            <UnreadCount unreadCount={props.subscription.unread} />
        </div>
    )
}
