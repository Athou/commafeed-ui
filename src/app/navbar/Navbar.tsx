import React, { useContext } from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import { ReadingMode, ReadingOrder } from '../../commafeed-api';
import { AppContext } from '../App';
import { ActionCreator } from '../AppReducer';

export const Navbar: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)

    function refreshClicked() {
        dispatch(ActionCreator.entries.reload())
    }

    function readingModeClicked() {
        if (!state.settings)
            return

        const mode: ReadingMode = state.settings.readingMode === ReadingMode.All ? ReadingMode.Unread : ReadingMode.All
        dispatch(ActionCreator.settings.setReadingMode(mode))
    }

    function readingOrderClicked() {
        if (!state.settings)
            return

        const order: ReadingOrder = state.settings.readingOrder === ReadingOrder.Desc ? ReadingOrder.Asc : ReadingOrder.Desc
        dispatch(ActionCreator.settings.setReadingOrder(order))
    }

    if (!state.settings)
        return null

    return (
        <Container>
            <Button.Group icon>
                <Button onClick={() => refreshClicked()}>
                    <Icon name="refresh" />
                </Button>
                <Button onClick={() => readingModeClicked()}   >
                    {state.settings.readingMode}
                </Button>
                <Button onClick={() => readingOrderClicked()}   >
                    {state.settings.readingOrder}
                </Button>
            </Button.Group>
        </Container >
    )
}