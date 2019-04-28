import React from 'react';
import { Button, Container, Icon } from 'semantic-ui-react';
import { Tree } from './Tree';

export const Sidebar: React.FC = () => {
    return (
        <Container fluid>
            <Button attached="top">
                <Icon name="feed" />
                <span>Subscribe</span>
            </Button>
            <Tree />
        </Container>
    )
}