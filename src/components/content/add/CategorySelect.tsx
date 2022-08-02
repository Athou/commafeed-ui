import { Select, SelectItem, SelectProps } from "@mantine/core"
import { useAppSelector } from "app/store"
import { flattenCategoryTree } from "app/utils"

export function CategorySelect(props: SelectProps) {
    const rootCategory = useAppSelector(state => state.tree.rootCategory)
    const categories = rootCategory && flattenCategoryTree(rootCategory)
    const selectData: SelectItem[] | undefined = categories?.map(c => ({
        label: c.name,
        value: c.id,
    }))

    return <Select {...props} data={selectData ?? []} disabled={!selectData} />
}
