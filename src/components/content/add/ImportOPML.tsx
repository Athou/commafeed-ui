import { Box, Button, FileInput, Group, Stack } from "@mantine/core"
import { useForm } from "@mantine/form"
import { client, errorToStrings } from "app/client"
import { redirectTo } from "app/slices/redirect"
import { useAppDispatch, useAppSelector } from "app/store"
import { Alert } from "components/Alert"
import useMutation from "use-mutation"

export function ImportOPML() {
    const source = useAppSelector(state => state.entries.source)
    const dispatch = useAppDispatch()

    const form = useForm<{ file: File }>({
        validate: {
            file: v => (v ? null : "file is required"),
        },
    })

    const [importOpml, importOpmlResult] = useMutation(client.feed.importOpml, {
        onSuccess: () => {
            dispatch(redirectTo(`/app/${source.type}/${source.id}`))
        },
    })
    const errors = errorToStrings(importOpmlResult.error)

    const returnToApp = () => dispatch(redirectTo(`/app/${source.type}/${source.id}`))

    return (
        <form onSubmit={form.onSubmit(v => importOpml(v.file))}>
            <Stack>
                <FileInput label="OPML file" placeholder="OPML file" {...form.getInputProps("file")} required accept="application/xml" />
                <Group position="center">
                    <Button variant="default" onClick={() => returnToApp()}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={importOpmlResult.status === "running"}>
                        Import
                    </Button>
                </Group>

                {errors && errors.length > 0 && (
                    <Box mt="md">
                        <Alert messages={errors} />
                    </Box>
                )}
            </Stack>
        </form>
    )
}
