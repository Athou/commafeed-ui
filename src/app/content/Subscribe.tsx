import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Tab, Tabs, TextField } from "@material-ui/core"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { clients } from "../.."
import { FeedInfo, FeedInfoRequest, SubscribeRequest } from "../../api/commafeed-api"
import { flattenCategoryTree } from "../../api/utils"
import { useAppDispatch } from "../App"
import { AppConstants } from "../AppConstants"
import { ActionCreator, State } from "../AppReducer"

export const Subscribe: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <Container>
            <Paper>
                <Box p={2} m={2}>
                    <Tabs value={selectedTab} onChange={(e, i) => setSelectedTab(i)}>
                        <Tab label="Subscribe" />
                        <Tab label="Import OPML" />
                    </Tabs>
                    <Box pt={2}>
                        {selectedTab === 0 && <SubscribeFetchPanel />}
                        {selectedTab === 1 && <ImportPanel />}
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}

export const SubscribeFetchPanel: React.FC = () => {
    const [feedUrl, setFeedUrl] = useState("")
    const [feedInfos, setFeedInfos] = useState<FeedInfo>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)
        setError(undefined)
        setFeedInfos(undefined)
        clients.feed
            .fetch(new FeedInfoRequest({ url: feedUrl }))
            .then(infos => setFeedInfos(infos))
            .catch(error => setError(error.response))
            .finally(() => setLoading(false))
    }

    return (
        <>
            <form onSubmit={e => handleSubmit(e)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Feed URL" required value={feedUrl} onChange={e => setFeedUrl(e.target.value)} />
                    </Grid>
                    <Grid item>
                        <Button type="submit" color="primary" variant="contained" disabled={loading}>
                            Fetch
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {error && (
                <>
                    Error while fetching feed
                    <pre>{error}</pre>
                </>
            )}
            {feedInfos && (
                <>
                    <Box mt={2}>
                        <SubscribePanel infos={feedInfos} />
                    </Box>
                </>
            )}
        </>
    )
}

const SubscribePanel: React.FC<{ infos: FeedInfo }> = props => {
    const root = useSelector((state: State) => state.tree.root)
    const dispatch = useAppDispatch()

    const [feedName, setFeedName] = useState(props.infos.title)
    const [categoryId, setCategoryId] = useState(AppConstants.ALL_CATEGORY_ID)
    const [loading, setLoading] = useState(false)

    if (!root) return null

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)
        clients.feed
            .subscribePost(
                new SubscribeRequest({
                    url: props.infos.url,
                    title: feedName,
                    categoryId: categoryId
                })
            )
            .then(() => {
                dispatch(ActionCreator.tree.reload())
                dispatch(ActionCreator.redirect.navigateToRootCategory())
            })
    }

    return (
        <div>
            <form onSubmit={e => handleSubmit(e)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth disabled label="Actual feed URL" value={props.infos.url} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth required label="Feed name" value={feedName} onChange={e => setFeedName(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select value={categoryId} onChange={e => setCategoryId(e.target.value as string)}>
                                {flattenCategoryTree(root).map(c => (
                                    <MenuItem value={c.id} key={c.id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex">
                            <Box mr={1}>
                                <Button type="submit" color="primary" variant="contained" disabled={loading}>
                                    Subscribe
                                </Button>
                            </Box>
                            <Box>
                                <Button variant="contained" disabled={loading}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

const ImportPanel: React.FC = props => {
    const [loading, setLoading] = useState(false)

    return (
        <>
            <form action="rest/feed/import" method="post" encType="multipart/form-data" onSubmit={() => setLoading(true)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <input type="file" name="file" required />
                    </Grid>
                    <Grid item>
                        <Button type="submit" color="primary" variant="contained" disabled={loading}>
                            Import
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}
