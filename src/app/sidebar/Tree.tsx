import { makeStyles } from "@material-ui/core"
import { Inbox } from "@material-ui/icons"
import React, { useContext } from "react"
import { Category } from "../../api/commafeed-api"
import { AppContext } from "../App"
import { AppConstants } from "../AppConstants"
import { TreeCategory } from "./TreeCategory"
import { TreeNode } from "./TreeNode"

const useStyles = makeStyles({
    root: {
        marginTop: "10px",
        marginRight: "5px",
        marginLeft: "5px"
    }
})

export const Tree: React.FC = props => {
    const { state } = useContext(AppContext)
    const classes = useStyles()
    if (!state.tree.root) return null

    return (
        <div className={classes.root}>
            <TreeCategory
                icon={<Inbox />}
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
                level={0}
            />
            {state.tree.root.children.map(c => (
                <TreeCategory category={c} level={0} key={c.id} />
            ))}
            {state.tree.root.feeds.map(f => (
                <TreeNode subscription={f} level={0} key={f.id} />
            ))}
        </div>
    )
}
