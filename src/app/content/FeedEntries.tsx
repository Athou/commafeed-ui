import React, { useContext, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Container, Header, Loader } from 'semantic-ui-react';
import { AppContext } from '../App';
import { ActionCreator, EntrySource } from '../AppReducer';
import { FeedEntry } from './FeedEntry';

interface Props {
    id: string,
    source: EntrySource
}

export const FeedEntries: React.FC<Props> = props => {

    const { state, dispatch } = useContext(AppContext)

    useEffect(() => {
        dispatch(ActionCreator.entries.setSource(props.id, props.source))
    }, [dispatch, props.id, props.source])

    if (!state.entries.label || !state.entries.entries)
        return null

    function loadMoreEntries(page: number) {
        dispatch(ActionCreator.entries.loadMore())
    }

    return (
        <>
            {state.entries.loading &&
                <Loader active>Loading</Loader>
            }
            {!state.entries.loading &&
                <Container>
                    <Header as="h1" dividing>{state.entries.label}</Header>
                    <InfiniteScroll initialLoad={false} loadMore={page => loadMoreEntries(page)} hasMore={state.entries.hasMore}
                        loader={<div className="loader" key={0}>Loading ...</div>}>
                        {state.entries.entries.map(e => <FeedEntry entry={e} key={e.id} />)}
                    </InfiniteScroll>
                </Container>}
        </>
    )
}