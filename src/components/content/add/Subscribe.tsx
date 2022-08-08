import { t, Trans } from "@lingui/macro"
import { Box, Button, Group, Paper, Stack, Stepper, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { client, errorToStrings } from "app/client"
import { Constants } from "app/constants"
import { redirectToSelectedSource } from "app/slices/redirect"
import { reloadTree } from "app/slices/tree"
import { useAppDispatch } from "app/store"
import { FeedInfoRequest, SubscribeRequest } from "app/types"
import { Alert } from "components/Alert"
import { useState } from "react"
import { TbRss } from "react-icons/tb"
import useMutation from "use-mutation"
import { CategorySelect } from "./CategorySelect"

export function Subscribe() {
    const [activeStep, setActiveStep] = useState(0)
    const dispatch = useAppDispatch()

    const step0Form = useForm<FeedInfoRequest>({
        initialValues: {
            url: "",
        },
    })

    const step1Form = useForm<SubscribeRequest>({
        initialValues: {
            url: "",
            title: "",
            categoryId: Constants.categoryIds.all,
        },
    })

    const [fetchFeed, fetchFeedResult] = useMutation(client.feed.fetchFeed, {
        onSuccess: ({ data }) => {
            step1Form.setFieldValue("url", data.data.url)
            step1Form.setFieldValue("title", data.data.title)
            setActiveStep(step => step + 1)
        },
    })
    const [subscribe, subscribeResult] = useMutation(client.feed.subscribe, {
        onSuccess: () => {
            dispatch(reloadTree())
            dispatch(redirectToSelectedSource())
        },
    })
    const errors = [...errorToStrings(fetchFeedResult.error), ...errorToStrings(subscribeResult.error)]

    const previousStep = () => {
        if (activeStep === 0) dispatch(redirectToSelectedSource())
        else setActiveStep(activeStep - 1)
    }
    const nextStep = (e: React.FormEvent<HTMLFormElement>) => {
        if (activeStep === 0) {
            step0Form.onSubmit(fetchFeed)(e)
        } else if (activeStep === 1) {
            step1Form.onSubmit(subscribe)(e)
        }
    }

    return (
        <Paper>
            <form onSubmit={nextStep}>
                <Stepper active={activeStep} onStepClick={setActiveStep}>
                    <Stepper.Step
                        label={t`Analyze feed`}
                        description={t`Check that the feed is working`}
                        allowStepSelect={activeStep === 1}
                    >
                        <TextInput
                            label={t`Feed URL`}
                            placeholder="http://www.mysite.com/rss"
                            required
                            autoFocus
                            {...step0Form.getInputProps("url")}
                        />
                    </Stepper.Step>
                    <Stepper.Step label={t`Subscribe`} description={t`Subscribe to the feed`} allowStepSelect={false}>
                        <Stack>
                            <TextInput label={t`Feed URL`} {...step1Form.getInputProps("url")} disabled />
                            <TextInput label={t`Feed name`} {...step1Form.getInputProps("title")} required autoFocus />
                            <CategorySelect label={t`Category`} {...step1Form.getInputProps("categoryId")} clearable />
                        </Stack>
                    </Stepper.Step>
                </Stepper>

                <Group position="center" mt="xl">
                    <Button variant="default" onClick={previousStep}>
                        <Trans>Back</Trans>
                    </Button>
                    {activeStep === 0 && (
                        <Button type="submit" loading={fetchFeedResult.status === "running"}>
                            <Trans>Next</Trans>
                        </Button>
                    )}
                    {activeStep === 1 && (
                        <Button
                            type="submit"
                            leftIcon={<TbRss size={16} />}
                            loading={fetchFeedResult.status === "running" || subscribeResult.status === "running"}
                        >
                            <Trans>Subscribe</Trans>
                        </Button>
                    )}
                </Group>
            </form>

            {errors.length > 0 && (
                <Box mt="md">
                    <Alert messages={errors} />
                </Box>
            )}
        </Paper>
    )
}
