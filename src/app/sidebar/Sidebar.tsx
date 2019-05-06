import React, { useContext } from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import { AppContext } from '../App';
import { Tree } from './Tree';

export const Sidebar: React.FC = () => {

    const { dispatch } = useContext(AppContext)

    return (
        <Container fluid>
            <Button attached="top" onClick={() => dispatch({ type: "navigateToSubscribe" })}>
                <Icon name="feed" />
                <span>Subscribe</span>
            </Button>
            <Tree />
        </Container>
    )
}