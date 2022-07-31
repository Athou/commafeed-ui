import { Box, Button, Container, Group, Paper, Stepper, TextInput, Title } from "@mantine/core"
import { client, errorToStrings } from "app/client"
import { redirectTo } from "app/slices/redirect"
import { reloadTree } from "app/slices/tree"
import { useAppDispatch, useAppSelector } from "app/store"
import { Alert } from "components/Alert"
import { useState } from "react"
import useMutation from "use-mutation"

export function SubscribePage() {
    const [activeStep, setActiveStep] = useState(0)

    const [url, setUrl] = useState("")
    const [feedName, setFeedName] = useState("")

    const source = useAppSelector(state => state.entries.source)
    const dispatch = useAppDispatch()

    const [fetchFeed, fetchFeedResult] = useMutation(client.feed.fetchFeed, {
        onSuccess: ({ data }) => {
            setFeedName(data.data.title)
            setActiveStep(step => step + 1)
        },
    })
    const [subscribe, subscribeResult] = useMutation(client.feed.subscribe, {
        onSuccess: () => {
            dispatch(reloadTree())
            setActiveStep(step => step + 1)
        },
    })
    const errors = [...errorToStrings(fetchFeedResult.error), ...errorToStrings(subscribeResult.error)]

    const returnToApp = () => dispatch(redirectTo(`/app/${source.type}/${source.id}`))
    const previousStep = () => {
        if (activeStep === 0) returnToApp()
        else setActiveStep(activeStep - 1)
    }
    const nextStep = (e: React.FormEvent) => {
        e.preventDefault()

        if (activeStep === 0) fetchFeed({ url })
        else if (activeStep === 1 && fetchFeedResult.data)
            subscribe({
                url: fetchFeedResult.data.data.url,
                title: feedName,
            })
        else returnToApp()
    }

    return (
        <Container size="sm">
            <Paper>
                <Title order={2} mb="md">
                    Subscribe
                </Title>

                <form onSubmit={nextStep}>
                    <Stepper active={activeStep} onStepClick={setActiveStep}>
                        <Stepper.Step label="Analyze feed" description="Check that the feed is working" allowStepSelect={activeStep === 1}>
                            <TextInput
                                label="Feed URL"
                                placeholder="http://www.mysite.com/rss"
                                required
                                autoFocus
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                        </Stepper.Step>
                        <Stepper.Step label="Subscribe" description="Subscribe to the feed" allowStepSelect={false}>
                            <TextInput label="Feed URL" value={fetchFeedResult.data?.data.url} onChange={() => {}} disabled />
                            <TextInput label="Feed name" value={feedName} onChange={e => setFeedName(e.target.value)} required autoFocus />
                        </Stepper.Step>
                    </Stepper>

                    <Group position="center" mt="xl">
                        {activeStep !== 2 && (
                            <Button variant="default" onClick={previousStep}>
                                Back
                            </Button>
                        )}
                        <Button type="submit" loading={fetchFeedResult.status === "running" || subscribeResult.status === "running"}>
                            {activeStep === 0 && "Next"}
                            {activeStep === 1 && "Subscribe"}
                            {activeStep === 2 && "Done"}
                        </Button>
                    </Group>
                </form>

                {errors && errors.length > 0 && (
                    <Box mt="md">
                        <Alert messages={errors} />
                    </Box>
                )}
            </Paper>
        </Container>
    )
}
