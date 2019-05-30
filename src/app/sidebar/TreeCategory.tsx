import { Box, createStyles, Grid, makeStyles, Typography } from "@material-ui/core"
import { ChevronRight, ExpandMore } from "@material-ui/icons"
import classNames from "classnames"
import React, { ReactNode, useContext, useMemo } from "react"
import { Category } from "../../api/commafeed-api"
import { flattenCategoryTree } from "../../api/utils"
import { AppContext } from "../App"
import { ActionCreator } from "../AppReducer"
import { TreeNode } from "./TreeNode"
import { UnreadCount } from "./UnreadCount"

const useStyles = (props: Props) =>
    makeStyles(theme =>
        createStyles({
            root: {
                cursor: "pointer",
                paddingTop: "1px",
                paddingBottom: "1px"
            },
            category: {
                paddingLeft: props.level * 20,
                "&:hover": {
                    backgroundColor: theme.palette.action.hover
                }
            },
            active: {
                backgroundColor: theme.palette.action.selected
            },
            icon: {
                height: "1.5em"
            }
        })
    )

interface Props {
    category: Category
    icon?: ReactNode
    level: number
    stayCollapsed?: boolean
}

export const TreeCategory: React.FC<Props> = props => {
    const { state, dispatch } = useContext(AppContext)

    const unreadCount = useMemo(
        () =>
            flattenCategoryTree(props.category)
                .flatMap(c => c.feeds)
                .map(f => f.unread)
                .reduce((total, current) => total + current, 0),
        [props.category]
    )
    const classes = useStyles(props)()
    const selected = state.entries.source === "category" && state.entries.id === props.category.id
    const expanded = props.category.expanded && !props.stayCollapsed
    const unread = !expanded && unreadCount > 0

    function toggleExpanded(e: React.MouseEvent) {
        if (props.stayCollapsed) return

        e.stopPropagation()
        dispatch(ActionCreator.tree.toggleCategoryExpanded(+props.category.id))
    }

    return (
        <div className={classes.root}>
            <Typography
                component="div"
                variant="body1"
                color={unread ? "textPrimary" : "textSecondary"}
                className={classNames({
                    [classes.category]: true,
                    [classes.active]: selected
                })}
                onClick={() => dispatch(ActionCreator.redirect.navigateToCategory(props.category.id))}
            >
                <Box display="flex" alignItems="center">
                    <Box className={classes.icon} onClick={e => toggleExpanded(e)}>
                        {props.icon ? props.icon : expanded ? <ExpandMore /> : <ChevronRight />}
                    </Box>
                    <Box flexGrow={1}>{props.category.name}</Box>
                    {!expanded && (
                        <Box>
                            <UnreadCount unreadCount={unreadCount} />
                        </Box>
                    )}
                </Box>
                <Grid container direction="row" alignItems="center" />
            </Typography>
            {expanded && (props.category.children.length > 0 || props.category.feeds.length > 0) && (
                <>
                    {props.category.children.map(c => (
                        <TreeCategory category={c} level={props.level + 1} key={c.id} />
                    ))}
                    {props.category.feeds.map(f => (
                        <TreeNode subscription={f} level={props.level + 1} key={f.id} />
                    ))}
                </>
            )}
        </div>
    )
}
