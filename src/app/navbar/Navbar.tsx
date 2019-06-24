import { AppBar, Button, IconButton, LinearProgress, makeStyles, Toolbar, Typography } from "@material-ui/core"
import { Add, DoneAll, Refresh } from "@material-ui/icons"
import React from "react"
import { useSelector } from "react-redux"
import { ReadingMode, ReadingOrder } from "../../api/commafeed-api"
import { useAppDispatch } from "../App"
import { AppConstants } from "../AppConstants"
import { ActionCreator, State } from "../AppReducer"
import { ProfileButton } from "./ProfileButton"

const useStyles = makeStyles({
    title: {
        flexGrow: 1,
        paddingLeft: AppConstants.SIDEBAR_WIDTH
    }
})

export const Navbar: React.FC = () => {
    const id = useSelector((state: State) => state.entries.id)
    const source = useSelector((state: State) => state.entries.source)
    const label = useSelector((state: State) => state.entries.label)
    const loading = useSelector((state: State) => state.entries.loading)
    const readingMode = useSelector((state: State) => state.settings && state.settings.readingMode)
    const readingOrder = useSelector((state: State) => state.settings && state.settings.readingOrder)
    const dispatch = useAppDispatch()
    const classes = useStyles()

    function refreshClicked() {
        dispatch(ActionCreator.entries.reload())
    }

    function markAllClicked() {
        if (!id || !source) return
        dispatch(ActionCreator.entries.markAllAsRead(id, source, new Date().getTime()))
    }

    function readingModeClicked() {
        if (!readingMode) return

        const mode: ReadingMode = readingMode === ReadingMode.All ? ReadingMode.Unread : ReadingMode.All
        dispatch(ActionCreator.settings.setReadingMode(mode))
    }

    function readingOrderClicked() {
        if (!readingOrder) return

        const order: ReadingOrder = readingOrder === ReadingOrder.Desc ? ReadingOrder.Asc : ReadingOrder.Desc
        dispatch(ActionCreator.settings.setReadingOrder(order))
    }

    if (!readingOrder || !readingMode) return null

    return (
        <AppBar position="fixed">
            <Toolbar variant="dense">
                <Typography variant="h5" className={classes.title}>
                    {label}
                </Typography>
                <div>
                    <IconButton color="inherit" onClick={() => dispatch(ActionCreator.redirect.navigateToSubscribe())}>
                        <Add />
                    </IconButton>
                    <IconButton color="inherit" onClick={() => refreshClicked()}>
                        <Refresh />
                    </IconButton>
                    <IconButton color="inherit" onClick={() => markAllClicked()}>
                        <DoneAll />
                    </IconButton>
                    <Button color="inherit" onClick={() => readingModeClicked()}>
                        {readingMode}
                    </Button>
                    <Button color="inherit" onClick={() => readingOrderClicked()}>
                        {readingOrder}
                    </Button>
                    <ProfileButton color="inherit" />
                </div>
            </Toolbar>
            {loading && <LinearProgress />}
        </AppBar>
    )
}
