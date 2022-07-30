import { Badge, createStyles } from "@mantine/core"
import React from "react"

const useStyles = createStyles(() => ({
    badge: {
        width: "3.2rem",
        // for some reason, mantine Badge has "cursor: 'default'"
        cursor: "pointer",
    },
}))

export const UnreadCount: React.FC<{ unreadCount: number }> = props => {
    const { classes } = useStyles()

    if (props.unreadCount <= 0) return null

    const count = props.unreadCount >= 1000 ? "999+" : props.unreadCount
    return <Badge className={classes.badge}>{count}</Badge>
}
