import type { Category } from "../types"
import { storage } from "./storage"
import { simulateApiDelay } from "./baseApi"

// Default categories with colors
const defaultCategories: Category[] = [
  { id: "1", name: "Продукты", type: "expense", color: "#FF5252" },
  { id: "2", name: "Транспорт", type: "expense", color: "#FF7043" },
  { id: "3", name: "Развлечения", type: "expense", color: "#FFCA28" },
  { id: "4", name: "Коммунальные услуги", type: "expense", color: "#66BB6A" },
  { id: "5", name: "Зарплата", type: "income", color: "#42A5F5" },
  { id: "6", name: "Фриланс", type: "income", color: "#5C6BC0" },
  { id: "7", name: "Подарки", type: "income", color: "#AB47BC" },
  { id: "8", name: "Инвестиции", type: "income", color: "#26A69A" },
]

export interface CreateCategoryRequest {
  name: string
  type: "income" | "expense"
  color: string
}

export interface CreateCategoryResponse {
  success: boolean
  category?: Category
  error?: string
}

export interface UpdateCategoryRequest {
  id: string
  updates: Partial<Omit<Category, "id">>
}

export interface UpdateCategoryResponse {
  success: boolean
  category?: Category
  error?: string
}

export interface DeleteCategoryResponse {
  success: boolean
  error?: string
}

export interface GetCategoriesResponse {
  success: boolean
  categories?: Category[]
  error?: string
}

export const categoryApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    await simulateApiDelay()
    return storage.get("categories", defaultCategories)
  },

  // Save categories to storage
  saveCategories: async (categories: Category[]): Promise<void> => {
    await simulateApiDelay()
    storage.set("categories", categories)
  },

  // Get categories with filters
  getCategoriesFiltered: async (filters?: {
    type?: "income" | "expense" | "all"
    search?: string
  }): Promise<GetCategoriesResponse> => {
    await simulateApiDelay(100, 300)

    try {
      let categories = await categoryApi.getCategories()

      // Apply filters
      if (filters) {
        if (filters.type && filters.type !== "all") {
          categories = categories.filter((c) => c.type === filters.type)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          categories = categories.filter((c) => c.name.toLowerCase().includes(searchLower))
        }
      }

      return { success: true, categories }
    } catch (error) {
      return { success: false, error: "Ошибка при получении категорий" }
    }
  },

  // Add new category
  createCategory: async (request: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    await simulateApiDelay(200, 600)

    try {
      const categories = await categoryApi.getCategories()

      // Check if category with same name and type already exists
      const exists = categories.some((c) => c.name === request.name && c.type === request.type)
      if (exists) {
        return { success: false, error: "Категория с таким названием уже существует" }
      }

      const newCategory: Category = {
        ...request,
        id: Date.now().toString(),
      }

      const updatedCategories = [...categories, newCategory]
      await categoryApi.saveCategories(updatedCategories)

      return { success: true, category: newCategory }
    } catch (error) {
      return { success: false, error: "Ошибка при добавлении категории" }
    }
  },

  // Update category
  updateCategory: async (request: UpdateCategoryRequest): Promise<UpdateCategoryResponse> => {
    await simulateApiDelay(200, 600)

    try {
      const categories = await categoryApi.getCategories()
      const categoryIndex = categories.findIndex((c) => c.id === request.id)

      if (categoryIndex === -1) {
        return { success: false, error: "Категория не найдена" }
      }

      // Check for duplicate name if name is being updated
      if (request.updates.name) {
        const exists = categories.some(
          (c) =>
            c.id !== request.id &&
            c.name === request.updates.name &&
            c.type === (request.updates.type || categories[categoryIndex].type),
        )
        if (exists) {
          return { success: false, error: "Категория с таким названием уже существует" }
        }
      }

      const updatedCategory = { ...categories[categoryIndex], ...request.updates }
      const updatedCategories = [...categories]
      updatedCategories[categoryIndex] = updatedCategory

      await categoryApi.saveCategories(updatedCategories)

      return { success: true, category: updatedCategory }
    } catch (error) {
      return { success: false, error: "Ошибка при обновлении категории" }
    }
  },

  // Delete category
  deleteCategory: async (id: string): Promise<DeleteCategoryResponse> => {
    await simulateApiDelay(200, 500)

    try {
      const categories = await categoryApi.getCategories()
      const filteredCategories = categories.filter((c) => c.id !== id)

      if (filteredCategories.length === categories.length) {
        return { success: false, error: "Категория не найдена" }
      }

      await categoryApi.saveCategories(filteredCategories)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Ошибка при удалении категории" }
    }
  },

  // Reset categories to default
  resetCategories: async (): Promise<{ success: boolean; categories?: Category[]; error?: string }> => {
    await simulateApiDelay(200, 500)

    try {
      await categoryApi.saveCategories(defaultCategories)
      return { success: true, categories: defaultCategories }
    } catch (error) {
      return { success: false, error: "Ошибка при сбросе категорий" }
    }
  },

  // Get category usage statistics
  getCategoryStats: async (): Promise<{
    success: boolean
    stats?: {
      totalCategories: number
      incomeCategories: number
      expenseCategories: number
      mostUsedCategories: Array<{ name: string; count: number }>
    }
    error?: string
  }> => {
    await simulateApiDelay(100, 300)

    try {
      const categories = await categoryApi.getCategories()
      const transactions = storage.get("transactions", [])

      const totalCategories = categories.length
      const incomeCategories = categories.filter((c) => c.type === "income").length
      const expenseCategories = categories.filter((c) => c.type === "expense").length

      // Calculate category usage
      const categoryUsage = transactions.reduce((acc: Record<string, number>, transaction: any) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + 1
        return acc
      }, {})

      const mostUsedCategories = Object.entries(categoryUsage)
        .map(([name, count]) => ({ name, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      return {
        success: true,
        stats: {
          totalCategories,
          incomeCategories,
          expenseCategories,
          mostUsedCategories,
        },
      }
    } catch (error) {
      return { success: false, error: "Ошибка при получении статистики категорий" }
    }
  },
}
