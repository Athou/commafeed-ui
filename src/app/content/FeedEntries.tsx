import React, { useContext, useEffect } from 'react';
import { Container, Header } from 'semantic-ui-react';
import { Clients } from '../..';
import { AppContext } from '../App';
import { FeedEntry } from './FeedEntry';

interface Props {
    id: string,
    source: "feed" | "category"
}

export const FeedEntries: React.FC<Props> = props => {

    const { state, dispatch } = useContext(AppContext)

    // reload entries when source or settings changes
    useEffect(() => {
        if (!state.settings.readingMode || !state.settings.readingOrder)
            return

        switch (props.source) {
            case "category":
                Clients.category.entries(props.id, state.settings.readingMode, undefined, undefined, undefined, state.settings.readingOrder)
                    .then(entries => dispatch({ type: "entries.setEntries", entries: entries.entries, label: entries.name }))
                break
            case "feed":
                Clients.feed.entries(props.id, state.settings.readingMode, undefined, undefined, undefined, state.settings.readingOrder)
                    .then(entries => dispatch({ type: "entries.setEntries", entries: entries.entries, label: entries.name }))
                break
            default: throw new Error()
        }
    }, [dispatch, props.id, props.source, state.settings.readingMode, state.settings.readingOrder])

    if (!state.entries.label || !state.entries.entries)
        return null

    return (
        <Container>
            <Header as="h1" dividing>{state.entries.label}</Header>
            {state.entries.entries.map(e => <FeedEntry entry={e} key={e.id} />)}
        </Container>
    )
}