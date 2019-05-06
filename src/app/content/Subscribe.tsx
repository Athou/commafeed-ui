import React, { useContext, useState } from 'react';
import { Button, Container, Divider, Dropdown, DropdownItemProps, Form, Header, Input } from 'semantic-ui-react';
import { Clients } from '../..';
import { FeedInfo, FeedInfoRequest, SubscribeRequest } from '../../commafeed-api';
import { flattenCategoryTree } from '../../utils';
import { AppContext } from '../App';

export const Subscribe: React.FC = () => {

    const [feedUrl, setFeedUrl] = useState("")
    const [feedInfos, setFeedInfos] = useState<FeedInfo>()

    function handleSubmit() {
        Clients.feed.fetch(new FeedInfoRequest({ url: feedUrl }))
            .then(infos => setFeedInfos(infos))
    }

    return (
        <div>
            <Container>
                <Header as="h1" dividing>Subscribe</Header>
                <Form onSubmit={() => handleSubmit()}>
                    <Form.Field>
                        <label>Feed URL</label>
                        <Input action={{ icon: "search", type: "submit" }} placeholder='Search...'
                            value={feedUrl} onChange={e => setFeedUrl(e.target.value)} />
                    </Form.Field>
                </Form>

                {feedInfos && <>
                    <Divider />
                    <SubscribePanel infos={feedInfos} />
                </>}
            </Container>
        </div>
    )
}

const SubscribePanel: React.FC<{ infos: FeedInfo }> = props => {

    const [feedUrl, setFeedUrl] = useState(props.infos.url)
    const [feedName, setFeedName] = useState(props.infos.title)
    const [categoryId, setCategoryId] = useState("")

    const { state, dispatch } = useContext(AppContext)

    if (!state.tree.root)
        return null

    const categoryOptions: DropdownItemProps[] = flattenCategoryTree(state.tree.root)
        .map(c => ({
            key: c.id,
            text: c.name,
            value: c.id
        }))

    function handleSubmit() {
        Clients.feed.subscribePost(new SubscribeRequest({
            url: feedUrl,
            title: feedName,
            categoryId: categoryId
        }))
            .then(() => Clients.category.get())
            .then(root => {
                dispatch({ type: "tree.setRoot", root: root })
                dispatch({ type: "navigateToRootCategory" })
            })
    }

    return (
        <div>
            <Form onSubmit={() => handleSubmit()}>
                <Form.Field>
                    <label>Feed URL</label>
                    <Input value={feedUrl} onChange={e => setFeedUrl(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Feed name</label>
                    <Input value={feedName} onChange={e => setFeedName(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>Category</label>
                    <Dropdown selection options={categoryOptions} onChange={(e, data) => setCategoryId(data.value as string)} />
                </Form.Field>
                <Button primary type="submit">Subscribe</Button>
                <Button>Cancel</Button>
            </Form>
        </div>
    )
}