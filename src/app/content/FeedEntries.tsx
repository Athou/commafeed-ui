import React, { useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Container, Header } from 'semantic-ui-react';
import { AppContext } from '../App';
import { EntrySource } from '../AppReducer';
import { FeedEntry } from './FeedEntry';

interface Props {
    id: string,
    source: EntrySource
}

export const FeedEntries: React.FC<Props> = props => {

    const { state, dispatch, controller } = useContext(AppContext)

    useEffect(() => {
        dispatch({ type: "entries.setSource", id: props.id, source: props.source })
    }, [dispatch, props.id, props.source])

    if (!state.entries.label || !state.entries.entries)
        return null

    function loadMoreEntries(page: number) {
        if (!state.entries.id || !state.entries.source || !state.settings.readingMode || !state.settings.readingOrder || !state.entries.entries)
            return

        if (state.entries.loading) {
            return
        }

        controller.loadMoreEntries(state.entries.id, state.entries.source, state.settings.readingMode, state.settings.readingOrder, state.entries.entries.length)
    }

    return (
        <Container>
            <Header as="h1" dividing>{state.entries.label}</Header>
            <InfiniteScroll initialLoad={false} loadMore={page => loadMoreEntries(page)} hasMore={state.entries.hasMore}
                loader={<div className="loader" key={0}>Loading ...</div>}>
                {state.entries.entries.map(e => <FeedEntry entry={e} key={e.id} />)}
            </InfiniteScroll>
        </Container>
    )
}