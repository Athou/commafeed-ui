import React, { useContext } from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import { AppContext } from '../App';
import { ActionCreator } from '../AppReducer';
import { Tree } from './Tree';

export const Sidebar: React.FC = () => {

    const { dispatch } = useContext(AppContext)

    return (
        <Container fluid>
            <Button attached="top" onClick={() => dispatch(ActionCreator.redirect.navigateToSubscribe())}>
                <Icon name="feed" />
                <span>Subscribe</span>
            </Button>
            <Tree />
        </Container>
    )
}