import { Box } from "@mantine/core"
import { redirectTo } from "app/slices/redirect"
import { collapseTreeCategory } from "app/slices/tree"
import { useAppDispatch, useAppSelector } from "app/store"
import { Category, Subscription } from "app/types"
import { categoryUnreadCount } from "app/utils"
import { Loader } from "components/Loader"
import React from "react"
import { FaChevronDown, FaChevronRight, FaInbox } from "react-icons/fa"
import { TreeNode } from "./TreeNode"

const allIcon = <FaInbox size={14} />
const expandedIcon = <FaChevronDown size={14} />
const collapsedIcon = <FaChevronRight size={14} />

export function Tree() {
    const root = useAppSelector(state => state.tree.rootCategory)
    const source = useAppSelector(state => state.entries.source)
    const dispatch = useAppDispatch()

    const feedClicked = (id: string) => dispatch(redirectTo(`app/feed/${id}`))
    const categoryClicked = (id: string) => dispatch(redirectTo(`app/category/${id}`))
    const categoryIconClicked = (e: React.MouseEvent, category: Category) => {
        e.stopPropagation()

        dispatch(
            collapseTreeCategory({
                id: +category.id,
                collapse: category.expanded,
            })
        )
    }

    const allCategoryNode = () => (
        <TreeNode
            id="all"
            name="All"
            icon={allIcon}
            unread={categoryUnreadCount(root)}
            selected={source.type === "category" && source.id === "all"}
            expanded={false}
            level={0}
            onClick={categoryClicked}
        />
    )

    const categoryNode = (category: Category, level: number = 0) => (
        <TreeNode
            id={category.id}
            name={category.name}
            icon={category.expanded ? expandedIcon : collapsedIcon}
            unread={categoryUnreadCount(category)}
            selected={source.type === "category" && source.id === category.id}
            expanded={category.expanded}
            level={level}
            onClick={categoryClicked}
            onIconClick={e => categoryIconClicked(e, category)}
            key={category.id}
        />
    )

    const feedNode = (feed: Subscription, level: number = 0) => (
        <TreeNode
            id={String(feed.id)}
            name={feed.name}
            icon={feed.iconUrl}
            unread={feed.unread}
            selected={source.type === "feed" && source.id === String(feed.id)}
            level={level}
            onClick={feedClicked}
            key={feed.id}
        />
    )

    const recursiveCategoryNode = (category: Category, level: number = 0) => (
        <React.Fragment key={`recursiveCategoryNode-${category.id}`}>
            {categoryNode(category, level)}
            {category.expanded && category.children.map(c => recursiveCategoryNode(c, level + 1))}
            {category.expanded && category.feeds.map(f => feedNode(f, level + 1))}
        </React.Fragment>
    )

    if (!root) return <Loader />
    return (
        <Box>
            {allCategoryNode()}
            {root.children.map(c => recursiveCategoryNode(c))}
            {root.feeds.map(f => feedNode(f))}
        </Box>
    )
}
