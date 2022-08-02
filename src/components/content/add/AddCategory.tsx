import { Box, Button, Group, Select, SelectItem, Stack, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { client, errorToStrings } from "app/client"
import { redirectTo } from "app/slices/redirect"
import { reloadTree } from "app/slices/tree"
import { useAppDispatch, useAppSelector } from "app/store"
import { AddCategoryRequest } from "app/types"
import { flattenCategoryTree } from "app/utils"
import { Alert } from "components/Alert"
import useMutation from "use-mutation"

export function AddCategory() {
    const source = useAppSelector(state => state.entries.source)
    const rootCategory = useAppSelector(state => state.tree.rootCategory)
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

    const categories = rootCategory && flattenCategoryTree(rootCategory)
    const selectData: SelectItem[] | undefined = categories?.map(c => ({
        label: c.name,
        value: c.id,
    }))

    return (
        <form onSubmit={form.onSubmit(addCategory)}>
            <Stack>
                <TextInput label="Category" placeholder="Category" {...form.getInputProps("name")} size="md" required />
                <Select label="Parent" data={selectData ?? []} required disabled={!selectData} {...form.getInputProps("parentId")} />
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
