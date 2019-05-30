import { makeStyles } from "@material-ui/core"
import { Inbox } from "@material-ui/icons"
import React, { useContext, useEffect } from "react"
import { AppContext } from "../App"
import { AppConstants } from "../AppConstants"
import { ActionCreator } from "../AppReducer"
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
    const { state, dispatch } = useContext(AppContext)
    const classes = useStyles()

    // load initial tree and refresh periodically
    useEffect(() => {
        dispatch(ActionCreator.tree.reload())

        const id = setInterval(() => dispatch(ActionCreator.tree.reload()), AppConstants.TREE_RELOAD_INTERVAL)
        return () => clearInterval(id)
    }, [dispatch])

    if (!state.tree.root) return null

    return (
        <div className={classes.root}>
            <TreeCategory icon={<Inbox />} stayCollapsed category={state.tree.root} level={0} />
            {state.tree.root.children.map(c => (
                <TreeCategory category={c} level={0} key={c.id} />
            ))}
            {state.tree.root.feeds.map(f => (
                <TreeNode subscription={f} level={0} key={f.id} />
            ))}
        </div>
    )
}
