import { makeStyles } from "@material-ui/core"
import { ChevronRight, ExpandMore, Inbox } from "@material-ui/icons"
import React, { useCallback, useContext, useEffect } from "react"
import { Category, Subscription } from "../../api/commafeed-api"
import { categoryUnreadCount } from "../../api/utils"
import { AppContext } from "../App"
import { AppConstants } from "../AppConstants"
import { ActionCreator } from "../AppReducer"
import { TreeNode } from "./TreeNode"

const useStyles = makeStyles({
    root: {
        marginTop: "10px",
        marginRight: "5px",
        marginLeft: "5px"
    }
})

const allIcon = <Inbox />
const expandedIcon = <ExpandMore />
const collapsedIcon = <ChevronRight />

export const Tree: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)
    const classes = useStyles()

    // load initial tree and refresh periodically
    useEffect(() => {
        dispatch(ActionCreator.tree.reload())

        const id = setInterval(() => dispatch(ActionCreator.tree.reload()), AppConstants.TREE_RELOAD_INTERVAL)
        return () => clearInterval(id)
    }, [dispatch])

    const categoryClicked = useCallback(
        (id: string) => {
            dispatch(ActionCreator.redirect.navigateToCategory(id))
        },
        [dispatch]
    )

    const categoryIconClicked = useCallback(
        (e: React.MouseEvent, id: string) => {
            e.stopPropagation()
            dispatch(ActionCreator.tree.toggleCategoryExpanded(+id))
        },
        [dispatch]
    )

    const feedClicked = useCallback(
        (id: string) => {
            dispatch(ActionCreator.redirect.navigateToFeed(+id))
        },
        [dispatch]
    )

    const allCategoryNode = () => (
        <TreeNode
            id={AppConstants.ALL_CATEGORY_ID}
            name="All"
            icon={allIcon}
            unread={categoryUnreadCount(state.tree.root)}
            selected={state.entries.source === "category" && AppConstants.ALL_CATEGORY_ID === state.entries.id}
            expanded={false}
            level={0}
            onClick={categoryClicked}
        />
    )

    const categoryNode = (category: Category, level: number = 0) => {
        return (
            <TreeNode
                id={category.id}
                name={category.name}
                icon={category.expanded ? expandedIcon : collapsedIcon}
                unread={categoryUnreadCount(category)}
                selected={state.entries.source === "category" && category.id === state.entries.id}
                expanded={category.expanded}
                level={level}
                onClick={categoryClicked}
                onIconClick={categoryIconClicked}
                key={category.id}
            />
        )
    }

    const feedNode = (feed: Subscription, level: number = 0) => {
        return (
            <TreeNode
                id={String(feed.id)}
                name={feed.name}
                icon={feed.iconUrl}
                unread={feed.unread}
                selected={state.entries.source === "feed" && String(feed.id) === state.entries.id}
                level={level}
                onClick={feedClicked}
                key={feed.id}
            />
        )
    }

    const recursiveCategoryNode = (category: Category, level: number = 0) => {
        return (
            <div>
                {categoryNode(category, level)}
                {category.expanded && category.children.map(c => recursiveCategoryNode(c, level + 1))}
                {category.expanded && category.feeds.map(f => feedNode(f, level + 1))}
            </div>
        )
    }

    if (!state.tree.root) return null
    return (
        <div className={classes.root}>
            {allCategoryNode()}
            {state.tree.root.children.map(c => recursiveCategoryNode(c))}
            {state.tree.root.feeds.map(f => feedNode(f))}
        </div>
    )
}
