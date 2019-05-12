import { Category } from "./commafeed-api"

export function visitCategoryTree(category: Category, visitor: (category: Category) => void): void {
    visitor(category)
    category.children.forEach(child => visitCategoryTree(child, visitor))
}

export function flattenCategoryTree(category: Category): Category[] {
    const categories: Category[] = []
    visitCategoryTree(category, c => categories.push(c))
    return categories
}
