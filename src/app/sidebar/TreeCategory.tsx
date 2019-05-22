import classNames from "classnames"
import React, { useContext, useMemo } from "react"
import { Icon, SemanticICONS } from "semantic-ui-react"
import { Category } from "../../commafeed-api"
import { flattenCategoryTree } from "../../utils"
import { AppContext } from "../App"
import { ActionCreator } from "../AppReducer"
import styles from "./Tree.module.css"
import { TreeNode } from "./TreeNode"
import { UnreadCount } from "./UnreadCount"

interface Props {
    category: Category
    icon?: SemanticICONS
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
    const selected = state.entries.source === "category" && state.entries.id === props.category.id
    const unread = !props.category.expanded && unreadCount > 0

    function toggleExpanded(e: React.MouseEvent) {
        e.stopPropagation()
        dispatch(ActionCreator.tree.toggleCategoryExpanded(+props.category.id))
    }

    return (
        <div
            style={{
                paddingTop: "1px",
                paddingBottom: "1px"
            }}
        >
            {!props.category.expanded && <UnreadCount unreadCount={unreadCount} />}
            <div
                className={classNames({
                    [styles.category]: true,
                    [styles.unread]: unread,
                    [styles.selected]: selected
                })}
                onClick={() => dispatch(ActionCreator.redirect.navigateToCategory(props.category.id))}
            >
                <span onClick={e => toggleExpanded(e)}>
                    <Icon name={props.icon ? props.icon : props.category.expanded ? "chevron down" : "chevron right"} />
                </span>
                {props.category.name}
            </div>
            {props.category.expanded && (props.category.children.length > 0 || props.category.feeds.length > 0) && (
                <div style={{ marginLeft: "20px" }}>
                    {props.category.children.map(c => (
                        <TreeCategory category={c} key={c.id} />
                    ))}
                    {props.category.feeds.map(f => (
                        <TreeNode subscription={f} key={f.id} />
                    ))}
                </div>
            )}
        </div>
    )
}
