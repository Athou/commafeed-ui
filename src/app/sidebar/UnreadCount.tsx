import React from "react"
import { Label } from "semantic-ui-react"
import styles from "./UnreadCount.module.css"

interface UnreadCountProps {
    unreadCount: number
}

export const UnreadCount: React.FC<UnreadCountProps> = props => {
    if (props.unreadCount <= 0) return null

    const count = props.unreadCount >= 1000 ? "999+" : props.unreadCount

    return (
        <Label circular color="grey" size="tiny" className={styles.label}>
            {count}
        </Label>
    )
}
