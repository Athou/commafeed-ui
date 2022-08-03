import { Anchor, Box, Button, Container, Divider, Group, Input, NumberInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { useForm } from "@mantine/form"
import { openConfirmModal } from "@mantine/modals"
import { client, errorToStrings } from "app/client"
import { redirectToRootCategory, redirectToSelectedSource } from "app/slices/redirect"
import { reloadTree } from "app/slices/tree"
import { useAppDispatch, useAppSelector } from "app/store"
import { CategoryModificationRequest } from "app/types"
import { flattenCategoryTree } from "app/utils"
import { Alert } from "components/Alert"
import { CategorySelect } from "components/content/add/CategorySelect"
import { Loader } from "components/Loader"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAsync } from "react-use"
import useMutation from "use-mutation"

export function CategoryDetailsPage() {
    const { id = "all" } = useParams()

    const apiKey = useAppSelector(state => state.user.profile?.apiKey)
    const dispatch = useAppDispatch()
    const query = useAsync(() => client.category.getRoot(), [])
    const category = query.value && flattenCategoryTree(query.value.data).find(c => c.id === id)

    const form = useForm<CategoryModificationRequest>()
    const { setValues } = form

    const [modify, modifyResult] = useMutation(client.category.modify, {
        onSuccess: () => {
            dispatch(reloadTree())
            dispatch(redirectToSelectedSource())
        },
    })
    const [deleteCategory, deleteCategoryResult] = useMutation(client.category.delete, {
        onSuccess: () => {
            dispatch(reloadTree())
            dispatch(redirectToRootCategory())
        },
    })
    const errors = [...errorToStrings(modifyResult.error), ...errorToStrings(deleteCategoryResult.error)]

    const openDeleteCategoryModal = () =>
        openConfirmModal({
            title: "Delete Category",
            centered: true,
            children: <Text size="sm">Are you sure you want to delete category {category?.name} ?</Text>,
            labels: { confirm: "Confirm", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () => deleteCategory({ id: +id }),
        })

    useEffect(() => {
        if (!category) return
        setValues({
            id: +category.id,
            name: category.name,
            parentId: category.parentId,
            position: category.position,
        })
    }, [setValues, category])

    if (!category) return <Loader />
    return (
        <Container size="sm">
            <form onSubmit={form.onSubmit(modify)}>
                <Stack>
                    <Title order={3}>{category.name}</Title>
                    <Input.Wrapper label="Generated feed url">
                        <Box>
                            {apiKey && <Anchor href={`rest/category/entriesAsFeed?id=${category.id}&apiKey=${apiKey}`}>Link</Anchor>}
                            {!apiKey && <span>Generate an API key in your profile first.</span>}
                        </Box>
                    </Input.Wrapper>

                    <TextInput label="Name" {...form.getInputProps("name")} required />
                    <CategorySelect label="Parent Category" {...form.getInputProps("parentId")} clearable />
                    <NumberInput label="Position" {...form.getInputProps("position")} required />

                    <Group>
                        <Button variant="default" onClick={() => dispatch(redirectToSelectedSource())}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={modifyResult.status === "running"}>
                            Save
                        </Button>
                        <Divider sx={{ height: "32px" }} orientation="vertical" />
                        <Button color="red" onClick={() => openDeleteCategoryModal()} loading={deleteCategoryResult.status === "running"}>
                            Delete
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
