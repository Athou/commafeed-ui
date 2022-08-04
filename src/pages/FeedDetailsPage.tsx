import { Anchor, Box, Button, Code, Container, Divider, Group, Input, NumberInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { openConfirmModal } from "@mantine/modals"
import { client, errorToStrings } from "app/client"
import { redirectToRootCategory, redirectToSelectedSource } from "app/slices/redirect"
import { reloadTree } from "app/slices/tree"
import { useAppDispatch, useAppSelector } from "app/store"
import { FeedModificationRequest } from "app/types"
import { Alert } from "components/Alert"
import { CategorySelect } from "components/content/add/CategorySelect"
import { Loader } from "components/Loader"
import { RelativeDate } from "components/RelativeDate"
import { useEffect } from "react"
import { TbDeviceFloppy, TbTrash } from "react-icons/tb"
import { useParams } from "react-router-dom"
import { useAsync } from "react-use"
import useMutation from "use-mutation"

function FilteringExpressionDescription() {
    return (
        <div>
            <div>
                If not empty, an expression evaluating to 'true' or 'false'. If false, new entries for this feed will be marked as read
                automatically.
            </div>
            <div>
                Available variables are 'title', 'content', 'url' 'author' and 'categories' and their content is converted to lower case to
                ease string comparison.
            </div>
            <div>
                Example: <Code>url.contains('youtube') or (author eq 'athou' and title.contains('github')</Code>.
            </div>
            <div>
                <span>Complete available syntax is available </span>
                <a href="http://commons.apache.org/proper/commons-jexl/reference/syntax.html" target="_blank" rel="noreferrer">
                    here
                </a>
                .
            </div>
        </div>
    )
}
export function FeedDetailsPage() {
    const { id } = useParams()
    if (!id) throw Error("id required")

    const apiKey = useAppSelector(state => state.user.profile?.apiKey)
    const dispatch = useAppDispatch()
    const query = useAsync(() => client.feed.get(id), [id])
    const feed = query.value?.data

    const form = useForm<FeedModificationRequest>()
    const { setValues } = form

    const [modify, modifyResult] = useMutation(client.feed.modify, {
        onSuccess: () => {
            dispatch(reloadTree())
            dispatch(redirectToSelectedSource())
        },
    })
    const [unsubscribe, unsubscribeResult] = useMutation(client.feed.unsubscribe, {
        onSuccess: () => {
            dispatch(reloadTree())
            dispatch(redirectToRootCategory())
        },
    })
    const errors = [...errorToStrings(modifyResult.error), ...errorToStrings(unsubscribeResult.error)]

    const openUnsubscribeModal = () =>
        openConfirmModal({
            title: "Unsubscribe",
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to unsubscribe from <Code>{feed?.name}</Code> ?
                </Text>
            ),
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () => unsubscribe({ id: +id }),
        })

    useEffect(() => {
        if (!feed) return
        setValues(feed)
    }, [setValues, feed])

    if (!feed) return <Loader />
    return (
        <Container size="sm">
            <form onSubmit={form.onSubmit(modify)}>
                <Stack>
                    <Title order={3}>{feed.name}</Title>
                    <Input.Wrapper label="Feed URL">
                        <Box>
                            <Anchor href={feed.feedUrl}>{feed.feedUrl}</Anchor>
                        </Box>
                    </Input.Wrapper>
                    <Input.Wrapper label="Website">
                        <Box>
                            <Anchor href={feed.feedLink}>{feed.feedLink}</Anchor>
                        </Box>
                    </Input.Wrapper>
                    <Input.Wrapper label="Last refresh">
                        <Box>
                            <RelativeDate date={feed.lastRefresh} />
                        </Box>
                    </Input.Wrapper>
                    <Input.Wrapper label="Last refresh message">
                        <Box>{feed.message ?? "N/A"}</Box>
                    </Input.Wrapper>
                    <Input.Wrapper label="Next refresh">
                        <Box>
                            <RelativeDate date={feed.nextRefresh} />
                        </Box>
                    </Input.Wrapper>
                    <Input.Wrapper label="Generated feed url">
                        <Box>
                            {apiKey && <Anchor href={`rest/feed/entriesAsFeed?id=${feed.id}&apiKey=${apiKey}`}>Link</Anchor>}
                            {!apiKey && <span>Generate an API key in your profile first.</span>}
                        </Box>
                    </Input.Wrapper>

                    <TextInput label="Name" {...form.getInputProps("name")} required />
                    <CategorySelect label="Category" {...form.getInputProps("categoryId")} clearable />
                    <NumberInput label="Position" {...form.getInputProps("position")} required />
                    <TextInput
                        label="Filtering expression"
                        description={<FilteringExpressionDescription />}
                        {...form.getInputProps("filter")}
                    />

                    <Group>
                        <Button variant="default" onClick={() => dispatch(redirectToSelectedSource())}>
                            Cancel
                        </Button>
                        <Button type="submit" leftIcon={<TbDeviceFloppy size={16} />} loading={modifyResult.status === "running"}>
                            Save
                        </Button>
                        <Divider sx={{ height: "32px" }} orientation="vertical" />
                        <Button
                            color="red"
                            leftIcon={<TbTrash size={16} />}
                            onClick={() => openUnsubscribeModal()}
                            loading={unsubscribeResult.status === "running"}
                        >
                            Unsubscribe
                        </Button>
                    </Group>

                    {errors.length > 0 && (
                        <Box mt="md">
                            <Alert messages={errors} />
                        </Box>
                    )}
                </Stack>
            </form>
        </Container>
    )
}