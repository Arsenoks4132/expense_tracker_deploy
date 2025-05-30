"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Transaction, Category, UserProfile, AuthState } from "@/shared/types"
import { authApi, transactionApi, categoryApi } from "@/shared/api"
import { storage } from "@/shared/api/storage"

interface AppContextType {
  transactions: Transaction[]
  categories: Category[]
  auth: AuthState
  loading: {
    transactions: boolean
    categories: boolean
    auth: boolean
  }
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<boolean>
  editTransaction: (id: string, transaction: Omit<Transaction, "id">) => Promise<boolean>
  addCategory: (category: Omit<Category, "id">) => Promise<boolean>
  updateCategory: (id: string, updates: Partial<Omit<Category, "id">>) => Promise<boolean>
  deleteCategory: (id: string) => Promise<boolean>
  deleteTransaction: (id: string) => Promise<boolean>
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>
  clearAllData: () => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, profile: UserProfile) => Promise<boolean>
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    error: null,
  })
  const [loading, setLoading] = useState({
    transactions: false,
    categories: false,
    auth: false,
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // Load initial data on client-side only
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load saved auth state
        const savedAuth = storage.get("auth", null)
        if (savedAuth) {
          setAuth(savedAuth)
        }

        // Load transactions and categories
        const [transactionsData, categoriesData] = await Promise.all([
          transactionApi.getTransactions(),
          categoryApi.getCategories(),
        ])

        setTransactions(transactionsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to initialize data:", error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeData()
  }, [])

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      storage.set("auth", auth)
    }
  }, [auth, isInitialized])

  const addTransaction = async (transactionData: Omit<Transaction, "id">): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, transactions: true }))
    try {
      const result = await transactionApi.createTransaction(transactionData)
      if (result.success && result.transaction) {
        setTransactions((prev) => [...prev, result.transaction!])
        return true
      } else {
        console.error("Failed to add transaction:", result.error)
        return false
      }
    } catch (error) {
      console.error("Error adding transaction:", error)
      return false
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }))
    }
  }

  const editTransaction = async (id: string, transactionData: Omit<Transaction, "id">): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, transactions: true }))
    try {
      const result = await transactionApi.updateTransaction({ id, data: transactionData })
      if (result.success && result.transaction) {
        setTransactions((prev) => prev.map((t) => (t.id === id ? result.transaction! : t)))
        return true
      } else {
        console.error("Failed to edit transaction:", result.error)
        return false
      }
    } catch (error) {
      console.error("Error editing transaction:", error)
      return false
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }))
    }
  }

  const deleteTransaction = async (id: string): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, transactions: true }))
    try {
      const result = await transactionApi.deleteTransaction(id)
      if (result.success) {
        setTransactions((prev) => prev.filter((t) => t.id !== id))
        return true
      } else {
        console.error("Failed to delete transaction:", result.error)
        return false
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
      return false
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }))
    }
  }

  const addCategory = async (categoryData: Omit<Category, "id">): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, categories: true }))
    try {
      const result = await categoryApi.createCategory(categoryData)
      if (result.success && result.category) {
        setCategories((prev) => [...prev, result.category!])
        return true
      } else {
        console.error("Failed to add category:", result.error)
        return false
      }
    } catch (error) {
      console.error("Error adding category:", error)
      return false
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }))
    }
  }

  const updateCategory = async (id: string, updates: Partial<Omit<Category, "id">>): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, categories: true }))
    try {
      const result = await categoryApi.updateCategory({ id, updates })
      if (result.success && result.category) {
        setCategories((prev) => prev.map((c) => (c.id === id ? result.category! : c)))
        return true
      } else {
        console.error("Failed to update category:", result.error)
        return false
      }
    } catch (error) {
      console.error("Error updating category:", error)
      return false
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }))
    }
  }

  const deleteCategory = async (id: string): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, categories: true }))
    try {
      const result = await categoryApi.deleteCategory(id)
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id))
        return true
      } else {
        console.error("Failed to delete category:", result.error)
        return false
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      return false
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }))
    }
  }

  const clearAllData = async (): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, transactions: true, categories: true }))
    try {
      const [transactionsResult, categoriesResult] = await Promise.all([
        transactionApi.clearAllTransactions(),
        categoryApi.resetCategories(),
      ])

      if (transactionsResult.success && categoriesResult.success) {
        setTransactions([])
        if (categoriesResult.categories) {
          setCategories(categoriesResult.categories)
        }
        return true
      } else {
        console.error("Failed to clear data")
        return false
      }
    } catch (error) {
      console.error("Error clearing data:", error)
      return false
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false, categories: false }))
    }
  }

  const updateUserProfile = async (profileUpdates: Partial<UserProfile>): Promise<boolean> => {
    if (!auth.user) return false

    setLoading((prev) => ({ ...prev, auth: true }))
    try {
      const result = await authApi.updateUserProfile({ userId: auth.user.id, profileUpdates })
      if (result.success && result.user) {
        setAuth((prev) => ({
          ...prev,
          user: result.user!,
          error: null,
        }))
        return true
      } else {
        setAuth((prev) => ({
          ...prev,
          error: result.error || "Failed to update profile",
        }))
        return false
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setAuth((prev) => ({
        ...prev,
        error: "Error updating profile",
      }))
      return false
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }))
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, auth: true }))
    try {
      const result = await authApi.login({ email, password })
      if (result.success && result.user) {
        setAuth({
          isAuthenticated: true,
          user: result.user,
          error: null,
        })
        return true
      } else {
        setAuth((prev) => ({
          ...prev,
          error: result.error || "Login failed",
        }))
        return false
      }
    } catch (error) {
      console.error("Error during login:", error)
      setAuth((prev) => ({
        ...prev,
        error: "Login error",
      }))
      return false
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }))
    }
  }

  const register = async (email: string, password: string, profile: UserProfile): Promise<boolean> => {
    setLoading((prev) => ({ ...prev, auth: true }))
    try {
      const result = await authApi.register({ email, password, profile })
      if (result.success && result.user) {
        setAuth({
          isAuthenticated: true,
          user: result.user,
          error: null,
        })
        return true
      } else {
        setAuth((prev) => ({
          ...prev,
          error: result.error || "Registration failed",
        }))
        return false
      }
    } catch (error) {
      console.error("Error during registration:", error)
      setAuth((prev) => ({
        ...prev,
        error: "Registration error",
      }))
      return false
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }))
    }
  }

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      error: null,
    })
  }

  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        auth,
        loading,
        addTransaction,
        editTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        deleteTransaction,
        updateUserProfile,
        clearAllData,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
