import { AppBar, Button, IconButton, makeStyles, Toolbar, Typography } from "@material-ui/core"
import { Add, Refresh } from "@material-ui/icons"
import React, { useContext } from "react"
import { ReadingMode, ReadingOrder } from "../../api/commafeed-api"
import { AppContext } from "../App"
import { AppConstants } from "../AppConstants"
import { ActionCreator } from "../AppReducer"
import { ProfileButton } from "./ProfileButton"

const useStyles = makeStyles({
    title: {
        flexGrow: 1,
        paddingLeft: AppConstants.SIDEBAR_WIDTH
    }
})

export const Navbar: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)
    const classes = useStyles()

    function refreshClicked() {
        dispatch(ActionCreator.entries.reload())
    }

    function readingModeClicked() {
        if (!state.settings) return

        const mode: ReadingMode = state.settings.readingMode === ReadingMode.All ? ReadingMode.Unread : ReadingMode.All
        dispatch(ActionCreator.settings.setReadingMode(mode))
    }

    function readingOrderClicked() {
        if (!state.settings) return

        const order: ReadingOrder = state.settings.readingOrder === ReadingOrder.Desc ? ReadingOrder.Asc : ReadingOrder.Desc
        dispatch(ActionCreator.settings.setReadingOrder(order))
    }

    if (!state.settings) return null

    return (
        <AppBar position="fixed">
            <Toolbar variant="dense">
                <Typography variant="h5" className={classes.title}>
                    {state.entries.label}
                </Typography>
                <div>
                    <IconButton color="inherit" onClick={() => dispatch(ActionCreator.redirect.navigateToSubscribe())}>
                        <Add />
                    </IconButton>
                    <IconButton color="inherit" onClick={() => refreshClicked()}>
                        <Refresh />
                    </IconButton>
                    <Button color="inherit" onClick={() => readingModeClicked()}>
                        {state.settings.readingMode}
                    </Button>
                    <Button color="inherit" onClick={() => readingOrderClicked()}>
                        {state.settings.readingOrder}
                    </Button>
                    <ProfileButton color="inherit" />
                </div>
            </Toolbar>
        </AppBar>
    )
}
