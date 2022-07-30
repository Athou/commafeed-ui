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
    onClick: (id: string) => void
    onIconClick?: (e: React.MouseEvent, id: string) => void
}

const useStyles = createStyles((theme, props: TreeNodeProps) => ({
    node: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
        backgroundColor: props.selected ? (theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]) : "inherit",
        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
    nodeText: {
        flexGrow: 1,
        textOverflow: "ellipsis",
    },
}))

export const TreeNode: React.FC<TreeNodeProps> = props => {
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
