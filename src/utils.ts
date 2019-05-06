import { Category } from "./commafeed-api";

export const visitCategoryTree: (category: Category, visitor: (category: Category) => void) => void = (category, visitor) => {
    visitor(category)
    category.children.forEach(child => visitCategoryTree(child, visitor))
}