import React, { useContext, useState } from 'react';
import { Button, Container, Divider, Dropdown, DropdownItemProps, Form, Header, Input, Message } from 'semantic-ui-react';
import { Clients } from '../..';
import { FeedInfo, FeedInfoRequest, SubscribeRequest } from '../../commafeed-api';
import { flattenCategoryTree } from '../../utils';
import { AppContext } from '../App';
import { AppConstants } from '../AppConstants';
import { ActionCreator } from '../AppReducer';

export const Subscribe: React.FC = () => {

    const [feedUrl, setFeedUrl] = useState("")
    const [feedInfos, setFeedInfos] = useState<FeedInfo>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    function handleSubmit() {
        setLoading(true)
        setError(undefined)
        setFeedInfos(undefined)
        Clients.feed.fetch(new FeedInfoRequest({ url: feedUrl }))
            .then(infos => setFeedInfos(infos))
            .catch(error => setError(error.response))
            .finally(() => setLoading(false))
    }

    return (
        <div>
            <Container>
                <Header as="h1" dividing>Subscribe</Header>
                <Form loading={loading} onSubmit={() => handleSubmit()}>
                    <Form.Field>
                        <label>Feed URL</label>
                        <Input action={{ icon: "search", type: "submit" }} placeholder="Search..."
                            value={feedUrl} onChange={e => setFeedUrl(e.target.value)} />
                    </Form.Field>
                </Form>

                {error &&
                    <Message negative>
                        <Message.Header>Error while fetching feed</Message.Header>
                        <pre>{error}</pre>
                    </Message>}
                {feedInfos && <>
                    <Divider />
                    <SubscribePanel infos={feedInfos} />
                </>}
            </Container>
        </div>
    )
}

const SubscribePanel: React.FC<{ infos: FeedInfo }> = props => {

    const [feedName, setFeedName] = useState(props.infos.title)
    const [categoryId, setCategoryId] = useState(AppConstants.ALL_CATEGORY_ID)
    const [loading, setLoading] = useState(false)

    const { state, dispatch } = useContext(AppContext)

    if (!state.tree.root)
        return null

    const categoryOptions: DropdownItemProps[] = flattenCategoryTree(state.tree.root)
        .map(c => ({
            value: c.id,
            text: c.name,
        }))

    function handleSubmit() {
        setLoading(true)
        Clients.feed.subscribePost(new SubscribeRequest({
            url: props.infos.url,
            title: feedName,
            categoryId: categoryId
        }))
            .then(() => {
                dispatch(ActionCreator.tree.reload())
                dispatch(ActionCreator.redirect.navigateToRootCategory())
            }).finally(() => setLoading(false))
    }

    return (
        <div>
            <Form loading={loading} onSubmit={() => handleSubmit()}>
                <Form.Field>
                    <label>Actual feed URL</label>
                    <Input value={props.infos.url} disabled />
                </Form.Field>
                <Form.Field>
                    <label>Feed name</label>
                    <Input value={feedName} onChange={e => setFeedName(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Category</label>
                    <Dropdown selection defaultValue={categoryId} options={categoryOptions}
                        onChange={(e, data) => setCategoryId(data.value as string)} />
                </Form.Field>
                <Button primary type="submit">Subscribe</Button>
                <Button>Cancel</Button>
            </Form>
        </div>
    )
}