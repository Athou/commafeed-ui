import { Box, Button, Group, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { client, errorToStrings } from "app/client"
import { redirectTo } from "app/slices/redirect"
import { reloadTree } from "app/slices/tree"
import { useAppDispatch, useAppSelector } from "app/store"
import { AddCategoryRequest } from "app/types"
import { Alert } from "components/Alert"
import useMutation from "use-mutation"
import { CategorySelect } from "./CategorySelect"

export function AddCategory() {
    const source = useAppSelector(state => state.entries.source)
    const dispatch = useAppDispatch()

    const form = useForm<AddCategoryRequest>({
        initialValues: {
            name: "",
            parentId: "all",
        },
    })

    const [addCategory, addCategoryResult] = useMutation(client.category.add, {
        onSuccess: () => {
            dispatch(reloadTree())
            dispatch(returnToApp())
        },
    })
    const errors = errorToStrings(addCategoryResult.error)

    const returnToApp = () => dispatch(redirectTo(`/app/${source.type}/${source.id}`))

    return (
        <form onSubmit={form.onSubmit(addCategory)}>
            <Stack>
                <TextInput label="Category" placeholder="Category" {...form.getInputProps("name")} size="md" required />
                <CategorySelect label="Parent" required {...form.getInputProps("parentId")} />
                <Group position="center">
                    <Button variant="default" onClick={() => returnToApp()}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={addCategoryResult.status === "running"}>
                        Save
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