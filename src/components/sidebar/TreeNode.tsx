import { Box, createStyles, Image } from "@mantine/core"
import React, { ReactNode } from "react"
import { UnreadCount } from "./UnreadCount"

interface TreeNodeProps {
    id: string
    name: string
    icon: ReactNode | string
    unread: number
    selected: boolean
    expanded?: boolean
    level: number
    hasError: boolean
    onClick: (id: string) => void
    onIconClick?: (e: React.MouseEvent, id: string) => void
}

const useStyles = createStyles((theme, props: TreeNodeProps) => {
    let backgroundColor = "inherit"
    if (props.selected) backgroundColor = theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]

    let color = theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black
    if (props.hasError) color = theme.colors.red[6]

    return {
        node: {
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            color,
            backgroundColor,
            "&:hover": {
                backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
            },
        },
        nodeText: {
            flexGrow: 1,
            textOverflow: "ellipsis",
        },
    }
})

export function TreeNode(props: TreeNodeProps) {
    const { classes } = useStyles(props)
    return (
        <Box py={1} pl={props.level * 20} className={classes.node} onClick={() => props.onClick(props.id)}>
            <Box mr={6} onClick={(e: React.MouseEvent) => props.onIconClick && props.onIconClick(e, props.id)}>
                {typeof props.icon === "string" ? <Image src={props.icon} alt="" width={18} height={18} /> : props.icon}
            </Box>
            <Box className={classes.nodeText}>{props.name}</Box>
            {!props.expanded && <UnreadCount unreadCount={props.unread} />}
        </Box>
    )
}
