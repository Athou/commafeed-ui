import React, { useContext } from "react"
import { Subscription } from "../../commafeed-api"
import { AppContext } from "../App"
import { ActionCreator } from "../AppReducer"
import { UnreadCount } from "./UnreadCount"

interface Props {
    subscription: Subscription
}

export const TreeNode: React.FC<Props> = props => {
    const { state, dispatch } = useContext(AppContext)

    const selected = state.entries.source === "feed" && state.entries.id === String(props.subscription.id)
    return (
        <div style={{ paddingTop: "1px", paddingBottom: "1px", color: selected ? "red" : "inherit" }}>
            <img
                src={props.subscription.iconUrl}
                alt="favicon"
                style={{ width: "16px", height: "16px", marginRight: "5px", position: "relative", top: "4px" }}
            />
            <span
                style={{ fontWeight: props.subscription.unread > 0 ? "bold" : "normal" }}
                className="pointer"
                onClick={() => dispatch(ActionCreator.redirect.navigateToFeed(props.subscription.id))}>
                {props.subscription.name}
            </span>
            <UnreadCount unreadCount={props.subscription.unread} />
        </div>
    )
}
