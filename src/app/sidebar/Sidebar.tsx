import { Button } from "@material-ui/core"
import { RssFeed } from "@material-ui/icons"
import React, { useContext } from "react"
import { AppContext } from "../App"
import { ActionCreator } from "../AppReducer"
import { Tree } from "./Tree"

export const Sidebar: React.FC = () => {
    const { dispatch } = useContext(AppContext)

    return (
        <>
            <Button variant="outlined" onClick={() => dispatch(ActionCreator.redirect.navigateToSubscribe())}>
                <RssFeed />
                Subscribe
            </Button>
            <Tree />
        </>
    )
}
