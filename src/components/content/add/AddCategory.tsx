import { Box, Button, Group, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { client, errorToStrings } from "app/client"
import { redirectToSelectedSource } from "app/slices/redirect"
import { reloadTree } from "app/slices/tree"
import { useAppDispatch } from "app/store"
import { AddCategoryRequest } from "app/types"
import { Alert } from "components/Alert"
import useMutation from "use-mutation"
import { CategorySelect } from "./CategorySelect"

export function AddCategory() {
    const dispatch = useAppDispatch()

    const form = useForm<AddCategoryRequest>()

    const [addCategory, addCategoryResult] = useMutation(client.category.add, {
        onSuccess: () => {
            dispatch(reloadTree())
            dispatch(redirectToSelectedSource())
        },
    })
    const errors = errorToStrings(addCategoryResult.error)

    return (
        <form onSubmit={form.onSubmit(addCategory)}>
            <Stack>
                <TextInput label="Category" placeholder="Category" {...form.getInputProps("name")} required />
                <CategorySelect label="Parent" required {...form.getInputProps("parentId")} />
                <Group position="center">
                    <Button variant="default" onClick={() => dispatch(redirectToSelectedSource())}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={addCategoryResult.status === "running"}>
                        Save
                    </Button>
                </Group>

                {errors.length > 0 && (
                    <Box mt="md">
                        <Alert messages={errors} />
                    </Box>
                )}
            </Stack>
        </form>
    )
}
