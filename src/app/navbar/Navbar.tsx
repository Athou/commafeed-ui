import React, { useContext } from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import { ReadingMode, ReadingOrder } from '../../commafeed-api';
import { AppContext } from '../App';

export const Navbar: React.FC = () => {
    const { state, dispatch } = useContext(AppContext)

    function readingModeClicked() {
        const mode: ReadingMode = state.settings.readingMode === ReadingMode.All ? ReadingMode.Unread : ReadingMode.All
        dispatch({ type: "settings.setReadingMode", readingMode: mode })
    }

    function readingOrderClicked() {
        const order: ReadingOrder = state.settings.readingOrder === ReadingOrder.Desc ? ReadingOrder.Asc : ReadingOrder.Desc
        dispatch({ type: "settings.setReadingOrder", readingOrder: order })
    }

    return (
        <Container fluid>
            <div style={{ marginLeft: 10, marginRight: 10 }}>
                <Button.Group icon>
                    <Button>
                        <Icon name="refresh" />
                    </Button>
                    <Button onClick={() => readingModeClicked()}   >
                        {state.settings.readingMode}
                    </Button>
                    <Button onClick={() => readingOrderClicked()}   >
                        {state.settings.readingOrder}
                    </Button>
                </Button.Group>
            </div>
        </Container >
    )
}