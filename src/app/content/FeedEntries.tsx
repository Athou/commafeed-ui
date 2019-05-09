import React, { useContext, useEffect } from 'react';
import { Container, Header, Loader } from 'semantic-ui-react';
import { AppContext } from '../App';
import { EntrySource } from '../AppReducer';
import { FeedEntry } from './FeedEntry';

interface Props {
    id: string,
    source: EntrySource
}

export const FeedEntries: React.FC<Props> = props => {

    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
        dispatch({ type: "entries.setSource", id: props.id, source: props.source })
    }, [dispatch, props.id, props.source])

    if (!state.entries.label || !state.entries.entries)
        return null

    return (
        <>
            {state.entries.loading &&
                <Loader active>Loading</Loader>
            }
            {!state.entries.loading &&
                <Container>
                    <Header as="h1" dividing>{state.entries.label}</Header>
                    {state.entries.entries.map(e => <FeedEntry entry={e} key={e.id} />)}
                </Container>}
        </>
    )
}