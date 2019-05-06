import { Category } from "./commafeed-api";

export const visitCategoryTree: (category: Category, visitor: (category: Category) => void) => void = (category, visitor) => {
    visitor(category)
    category.children.forEach(child => visitCategoryTree(child, visitor))
}

export const flattenCategoryTree: (category: Category) => Category[] = (category) => {
    const categories: Category[] = []
    visitCategoryTree(category, c => categories.push(c))
    return categories
}