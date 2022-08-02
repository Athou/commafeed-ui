import { Box, Button, Center, FileButton, Stack } from "@mantine/core"
import { client, errorToStrings } from "app/client"
import { redirectTo } from "app/slices/redirect"
import { useAppDispatch, useAppSelector } from "app/store"
import { Alert } from "components/Alert"
import useMutation from "use-mutation"

export function ImportOPML() {
    const source = useAppSelector(state => state.entries.source)
    const dispatch = useAppDispatch()
    const [importOpml, importOpmlResult] = useMutation(client.feed.importOpml, {
        onSuccess: () => {
            dispatch(redirectTo(`/app/${source.type}/${source.id}`))
        },
    })
    const errors = errorToStrings(importOpmlResult.error)

    return (
        <Stack>
            <Center>
                <FileButton onChange={file => file && importOpml(file)} accept="application/xml">
                    {props => <Button {...props}>Import OPML File</Button>}
                </FileButton>
            </Center>

            {errors && errors.length > 0 && (
                <Box mt="md">
                    <Alert messages={errors} />
                </Box>
            )}
        </Stack>
    )
}
