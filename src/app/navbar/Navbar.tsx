import { Box, Button, Container, Typography } from "@material-ui/core"
import { Refresh } from "@material-ui/icons"
import React, { useContext } from "react"
import { ReadingMode, ReadingOrder } from "../../api/commafeed-api"
import { AppContext } from "../App"
import { ActionCreator } from "../AppReducer"

export const Navbar: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)

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
        <Container>
            <Box display="flex" alignItems="center">
                <Box flexGrow={1}>
                    <Typography variant="h5" color="textPrimary">
                        {state.entries.label}
                    </Typography>
                </Box>
                <Box>
                    <Button onClick={() => refreshClicked()}>
                        <Refresh />
                    </Button>
                    <Button onClick={() => readingModeClicked()}>{state.settings.readingMode}</Button>
                    <Button onClick={() => readingOrderClicked()}>{state.settings.readingOrder}</Button>
                </Box>
            </Box>
        </Container>
    )
}
