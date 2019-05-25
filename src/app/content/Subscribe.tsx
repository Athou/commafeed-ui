import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@material-ui/core"
import React, { useContext, useState } from "react"
import { Clients } from "../../api/Clients"
import { FeedInfo, FeedInfoRequest, SubscribeRequest } from "../../api/commafeed-api"
import { flattenCategoryTree } from "../../api/utils"
import { AppContext } from "../App"
import { AppConstants } from "../AppConstants"
import { ActionCreator } from "../AppReducer"

export const Subscribe: React.FC = () => {
    const [feedUrl, setFeedUrl] = useState("")
    const [feedInfos, setFeedInfos] = useState<FeedInfo>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)
        setError(undefined)
        setFeedInfos(undefined)
        Clients.feed
            .fetch(new FeedInfoRequest({ url: feedUrl }))
            .then(infos => setFeedInfos(infos))
            .catch(error => setError(error.response))
            .finally(() => setLoading(false))
    }

    return (
        <Container>
            <Paper>
                <Box p={2} m={2}>
                    <Typography variant="h4">Subscribe</Typography>
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
                </Box>
            </Paper>
        </Container>
    )
}

const SubscribePanel: React.FC<{ infos: FeedInfo }> = props => {
    const [feedName, setFeedName] = useState(props.infos.title)
    const [categoryId, setCategoryId] = useState(AppConstants.ALL_CATEGORY_ID)
    const [loading, setLoading] = useState(false)

    const { state, dispatch } = useContext(AppContext)

    if (!state.tree.root) return null

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        setLoading(true)
        Clients.feed
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
                                {flattenCategoryTree(state.tree.root).map(c => (
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
