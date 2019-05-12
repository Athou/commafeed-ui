import React from "react"
import { Label } from "semantic-ui-react"

interface UnreadCountProps {
    unreadCount: number
}

export const UnreadCount: React.FC<UnreadCountProps> = props => {
    if (props.unreadCount <= 0) return null

    return (
        <Label circular color="grey" size="tiny" style={{ float: "right" }}>
            {props.unreadCount}
        </Label>
    )
}
