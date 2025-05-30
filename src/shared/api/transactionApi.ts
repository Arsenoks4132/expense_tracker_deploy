import type { Transaction } from "../types"
import { storage } from "./storage"
import { simulateApiDelay } from "./baseApi"

export interface CreateTransactionRequest {
  type: "income" | "expense"
  amount: number
  date: string
  category: string
  description?: string
}

export interface CreateTransactionResponse {
  success: boolean
  transaction?: Transaction
  error?: string
}

export interface UpdateTransactionRequest {
  id: string
  data: Omit<Transaction, "id">
}

export interface UpdateTransactionResponse {
  success: boolean
  transaction?: Transaction
  error?: string
}

export interface DeleteTransactionResponse {
  success: boolean
  error?: string
}

export interface GetTransactionsResponse {
  success: boolean
  transactions?: Transaction[]
  error?: string
}

export const transactionApi = {
  // Get all transactions
  getTransactions: async (): Promise<Transaction[]> => {
    await simulateApiDelay()
    return storage.get("transactions", [])
  },

  // Save transactions to storage
  saveTransactions: async (transactions: Transaction[]): Promise<void> => {
    await simulateApiDelay()
    storage.set("transactions", transactions)
  },

  // Get transactions with filters and pagination
  getTransactionsFiltered: async (filters?: {
    startDate?: string
    endDate?: string
    type?: "income" | "expense" | "all"
    category?: string
    limit?: number
    offset?: number
  }): Promise<GetTransactionsResponse> => {
    await simulateApiDelay(200, 500)

    try {
      let transactions = await transactionApi.getTransactions()

      // Apply filters
      if (filters) {
        if (filters.startDate) {
          transactions = transactions.filter((t) => new Date(t.date) >= new Date(filters.startDate!))
        }
        if (filters.endDate) {
          transactions = transactions.filter((t) => new Date(t.date) <= new Date(filters.endDate!))
        }
        if (filters.type && filters.type !== "all") {
          transactions = transactions.filter((t) => t.type === filters.type)
        }
        if (filters.category) {
          transactions = transactions.filter((t) => t.category === filters.category)
        }

        // Apply pagination
        if (filters.offset !== undefined) {
          transactions = transactions.slice(filters.offset)
        }
        if (filters.limit !== undefined) {
          transactions = transactions.slice(0, filters.limit)
        }
      }

      return { success: true, transactions }
    } catch (error) {
      return { success: false, error: "Ошибка при получении транзакций" }
    }
  },

  // Add new transaction
  createTransaction: async (request: CreateTransactionRequest): Promise<CreateTransactionResponse> => {
    await simulateApiDelay(200, 600)

    try {
      const transactions = await transactionApi.getTransactions()

      const newTransaction: Transaction = {
        ...request,
        id: Date.now().toString(),
      }

      const updatedTransactions = [...transactions, newTransaction]
      await transactionApi.saveTransactions(updatedTransactions)

      return { success: true, transaction: newTransaction }
    } catch (error) {
      return { success: false, error: "Ошибка при добавлении операции" }
    }
  },

  // Update transaction
  updateTransaction: async (request: UpdateTransactionRequest): Promise<UpdateTransactionResponse> => {
    await simulateApiDelay(200, 600)

    try {
      const transactions = await transactionApi.getTransactions()
      const transactionIndex = transactions.findIndex((t) => t.id === request.id)

      if (transactionIndex === -1) {
        return { success: false, error: "Операция не найдена" }
      }

      const updatedTransaction: Transaction = { ...request.data, id: request.id }
      const updatedTransactions = [...transactions]
      updatedTransactions[transactionIndex] = updatedTransaction

      await transactionApi.saveTransactions(updatedTransactions)

      return { success: true, transaction: updatedTransaction }
    } catch (error) {
      return { success: false, error: "Ошибка при обновлении операции" }
    }
  },

  // Delete transaction
  deleteTransaction: async (id: string): Promise<DeleteTransactionResponse> => {
    await simulateApiDelay(200, 500)

    try {
      const transactions = await transactionApi.getTransactions()
      const filteredTransactions = transactions.filter((t) => t.id !== id)

      if (filteredTransactions.length === transactions.length) {
        return { success: false, error: "Операция не найдена" }
      }

      await transactionApi.saveTransactions(filteredTransactions)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Ошибка при удалении операции" }
    }
  },

  // Clear all transactions
  clearAllTransactions: async (): Promise<DeleteTransactionResponse> => {
    await simulateApiDelay(200, 500)

    try {
      await transactionApi.saveTransactions([])
      return { success: true }
    } catch (error) {
      return { success: false, error: "Ошибка при очистке операций" }
    }
  },

  // Get transaction statistics
  getTransactionStats: async (): Promise<{
    success: boolean
    stats?: {
      totalIncome: number
      totalExpense: number
      balance: number
      transactionCount: number
      categoriesUsed: string[]
    }
    error?: string
  }> => {
    await simulateApiDelay(100, 300)

    try {
      const transactions = await transactionApi.getTransactions()

      const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      const balance = totalIncome - totalExpense
      const transactionCount = transactions.length
      const categoriesUsed = [...new Set(transactions.map((t) => t.category))]

      return {
        success: true,
        stats: {
          totalIncome,
          totalExpense,
          balance,
          transactionCount,
          categoriesUsed,
        },
      }
    } catch (error) {
      return { success: false, error: "Ошибка при получении статистики" }
    }
  },
}
