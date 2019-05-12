import React, { useContext } from "react"
import { Category } from "../../commafeed-api"
import { AppContext } from "../App"
import { AppConstants } from "../AppConstants"
import { TreeCategory } from "./TreeCategory"
import { TreeNode } from "./TreeNode"

export const Tree: React.FC = props => {
    const { state } = useContext(AppContext)
    if (!state.tree.root) return null

    return (
        <div style={{ marginRight: 5, marginLeft: 5 }}>
            <TreeCategory
                icon={"inbox"}
                category={
                    new Category({
                        id: AppConstants.ALL_CATEGORY_ID,
                        name: "All",
                        expanded: true,
                        position: 0,
                        children: [],
                        feeds: []
                    })
                }
            />
            {state.tree.root.children.map(c => (
                <TreeCategory category={c} key={c.id} />
            ))}
            {state.tree.root.feeds.map(f => (
                <TreeNode subscription={f} key={f.id} />
            ))}
        </div>
    )
}
