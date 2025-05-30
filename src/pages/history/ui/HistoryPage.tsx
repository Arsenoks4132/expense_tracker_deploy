"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useAppContext } from "@/app/providers/AppProvider"
import { formatCurrency, formatDate } from "@/shared/lib/calculations"
import type { Transaction } from "@/shared/types"

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "category-asc" | "category-desc"

export default function History() {
  const { transactions, categories, deleteTransaction, editTransaction } = useAppContext()
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "all",
    category: "all",
  })
  const [sortOption, setSortOption] = useState<SortOption>("date-desc")
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingTransaction) return

    const { name, value } = e.target
    setEditingTransaction((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
      }
    })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTransaction) return

    editTransaction(editingTransaction.id, {
      type: editingTransaction.type,
      amount: editingTransaction.amount,
      date: editingTransaction.date,
      category: editingTransaction.category,
      description: editingTransaction.description || "",
    })

    setEditingTransaction(null)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date)

    if (filters.startDate && new Date(filters.startDate) > transactionDate) {
      return false
    }

    if (filters.endDate && new Date(filters.endDate) < transactionDate) {
      return false
    }

    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false
    }

    if (filters.category !== "all" && transaction.category !== filters.category) {
      return false
    }

    return true
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortOption) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "amount-desc":
        return b.amount - a.amount
      case "amount-asc":
        return a.amount - b.amount
      case "category-asc":
        return a.category.localeCompare(b.category)
      case "category-desc":
        return b.category.localeCompare(a.category)
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  const filteredCategories = categories.filter((category) => filters.type === "all" || category.type === filters.type)

  return (
    <>
      <Helmet>
        <title>История операций - Учёт финансов</title>
      </Helmet>
      <div className="p-4 max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">История операций</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col gap-2">
            <label htmlFor="startDate" className="font-medium text-slate-700 text-sm">
              С даты:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 focus:scale-105"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="endDate" className="font-medium text-slate-700 text-sm">
              По дату:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 focus:scale-105"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="font-medium text-slate-700 text-sm">
              Тип:
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
            >
              <option value="all">Все</option>
              <option value="income">Доходы</option>
              <option value="expense">Расходы</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="font-medium text-slate-700 text-sm">
              Категория:
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
            >
              <option value="all">Все</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="sort" className="font-medium text-slate-700 text-sm">
              Сортировка:
            </label>
            <select
              id="sort"
              name="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
            >
              <option value="date-desc">По дате (сначала новые)</option>
              <option value="date-asc">По дате (сначала старые)</option>
              <option value="amount-desc">По сумме (по убыванию)</option>
              <option value="amount-asc">По сумме (по возрастанию)</option>
              {filters.category === "all" && (
                <>
                  <option value="category-asc">По категории (А-Я)</option>
                  <option value="category-desc">По категории (Я-А)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {editingTransaction && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="mb-4 text-slate-900 text-lg font-medium">Редактировать операцию</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-type" className="font-medium text-slate-700 text-sm">
                    Тип:
                  </label>
                  <select
                    id="edit-type"
                    name="type"
                    value={editingTransaction.type}
                    onChange={handleEditChange}
                    className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  >
                    <option value="income">Доход</option>
                    <option value="expense">Расход</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-amount" className="font-medium text-slate-700 text-sm">
                    Сумма:
                  </label>
                  <input
                    type="number"
                    id="edit-amount"
                    name="amount"
                    value={editingTransaction.amount}
                    onChange={handleEditChange}
                    className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-date" className="font-medium text-slate-700 text-sm">
                    Дата:
                  </label>
                  <input
                    type="date"
                    id="edit-date"
                    name="date"
                    value={editingTransaction.date}
                    onChange={handleEditChange}
                    className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="edit-category" className="font-medium text-slate-700 text-sm">
                    Категория:
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={editingTransaction.category}
                    onChange={handleEditChange}
                    className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories
                      .filter((category) => category.type === editingTransaction.type)
                      .map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="edit-description" className="font-medium text-slate-700 text-sm">
                  Описание:
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editingTransaction.description || ""}
                  onChange={handleEditChange}
                  className="p-2 border border-slate-200 rounded text-sm resize-vertical min-h-[60px] transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded font-medium transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium transition-all duration-200 hover:bg-slate-300 hover:-translate-y-0.5"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {sortedTransactions.length === 0 ? (
          <p className="text-center text-slate-500 italic p-8 bg-white rounded-lg shadow-sm">
            Нет операций, соответствующих фильтрам
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {sortedTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className={`bg-white rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  transaction.type === "income" ? "border-l-4 border-l-green-600" : "border-l-4 border-l-red-600"
                }`}
              >
                <div className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <strong className="text-slate-900 text-base">{transaction.category}</strong>
                    <p className="text-slate-600 text-sm my-1">{transaction.description || "Без описания"}</p>
                    <small className="text-slate-400 text-xs">{formatDate(transaction.date)}</small>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p
                      className={`font-semibold text-base mb-0 ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-all duration-200 text-sm"
                        onClick={() => setEditingTransaction(transaction)}
                        aria-label="Редактировать"
                      >
                        ✎
                      </button>
                      <button
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-all duration-200 text-sm"
                        onClick={() => deleteTransaction(transaction.id)}
                        aria-label="Удалить"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
