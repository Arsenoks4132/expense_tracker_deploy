"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useAppContext } from "@/app/providers/AppProvider"
import type { TransactionType } from "@/shared/types"

const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const colorOptions = [
  "#FF5252",
  "#FF7043",
  "#FFCA28",
  "#66BB6A",
  "#42A5F5",
  "#5C6BC0",
  "#AB47BC",
  "#26A69A",
  "#EC407A",
  "#7E57C2",
  "#29B6F6",
  "#26C6DA",
  "#9CCC65",
  "#FFA726",
  "#8D6E63",
  "#78909C",
]

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppContext()

  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "income" as TransactionType,
    color: getRandomColor(),
  })

  const [editingCategory, setEditingCategory] = useState<{
    id: string
    name: string
    color: string
  } | null>(null)

  const [showColorPicker, setShowColorPicker] = useState(false)
  const [editShowColorPicker, setEditShowColorPicker] = useState(false)

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCategory.name.trim()) return

    addCategory({
      name: newCategory.name.trim(),
      type: newCategory.type,
      color: newCategory.color,
    })

    setNewCategory({
      name: "",
      type: "income",
      color: getRandomColor(),
    })
    setShowColorPicker(false)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingCategory || !editingCategory.name.trim()) return

    updateCategory(editingCategory.id, {
      name: editingCategory.name.trim(),
      color: editingCategory.color,
    })
    setEditingCategory(null)
    setEditShowColorPicker(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      deleteCategory(id)
    }
  }

  const incomeCategories = categories.filter((category) => category.type === "income")
  const expenseCategories = categories.filter((category) => category.type === "expense")

  return (
    <>
      <Helmet>
        <title>Категории - Учёт финансов</title>
      </Helmet>
      <div className="p-4 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Категории</h2>

        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="mb-4 text-slate-900 text-lg font-medium">Добавить категорию</h3>

          <div className="mb-4">
            <label htmlFor="categoryName" className="block mb-2 font-medium text-slate-700 text-sm">
              Название
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategory.name}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
              placeholder="Название категории"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="categoryType" className="block mb-2 font-medium text-slate-700 text-sm">
                Тип
              </label>
              <select
                id="categoryType"
                value={newCategory.type}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, type: e.target.value as TransactionType }))}
                className="w-full p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
              >
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>

            <div>
              <label htmlFor="categoryColor" className="block mb-2 font-medium text-slate-700 text-sm">
                Цвет
              </label>
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  className="w-10 h-10 border border-slate-200 rounded cursor-pointer transition-transform duration-200 hover:scale-105"
                  style={{ backgroundColor: newCategory.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <input
                  type="text"
                  id="categoryColor"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, color: e.target.value }))}
                  className="flex-1 p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                />
              </div>
              {showColorPicker && (
                <div className="grid grid-cols-8 gap-2 mt-2 p-2 bg-slate-50 rounded">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 border border-slate-200 rounded cursor-pointer transition-transform duration-200 hover:scale-110"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setNewCategory((prev) => ({ ...prev, color }))
                        setShowColorPicker(false)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5"
          >
            Добавить
          </button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="mb-4 text-slate-900 text-lg font-medium">Категории доходов</h3>
            {incomeCategories.length === 0 ? (
              <p className="text-center text-slate-500 italic p-8 bg-white rounded-lg shadow-sm">
                Нет категорий доходов
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {incomeCategories.map((category) => (
                  <li key={category.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
                    {editingCategory && editingCategory.id === category.id ? (
                      <form onSubmit={handleEditSubmit} className="w-full">
                        <div className="flex gap-2 items-center mb-2">
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                            }
                            className="flex-1 p-1 border border-slate-200 rounded text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2 items-center">
                            <button
                              type="button"
                              className="w-10 h-10 border border-slate-200 rounded cursor-pointer transition-transform duration-200 hover:scale-105"
                              style={{ backgroundColor: editingCategory.color }}
                              onClick={() => setEditShowColorPicker(!editShowColorPicker)}
                            />
                            <input
                              type="text"
                              value={editingCategory.color}
                              onChange={(e) =>
                                setEditingCategory((prev) => (prev ? { ...prev, color: e.target.value } : null))
                              }
                              className="w-20 p-1 border border-slate-200 rounded text-sm"
                            />
                          </div>
                        </div>
                        {editShowColorPicker && (
                          <div className="grid grid-cols-4 gap-2 mb-2 p-2 bg-slate-50 rounded">
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-8 h-8 border border-slate-200 rounded cursor-pointer transition-transform duration-200 hover:scale-110"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setEditingCategory((prev) => (prev ? { ...prev, color } : null))
                                  setEditShowColorPicker(false)
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 justify-end">
                          <button
                            type="submit"
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-green-700"
                          >
                            Сохранить
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-slate-300"
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border border-slate-200"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setEditingCategory({ id: category.id, name: category.name, color: category.color })
                            }
                            className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-slate-200"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-red-200"
                          >
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="mb-4 text-slate-900 text-lg font-medium">Категории расходов</h3>
            {expenseCategories.length === 0 ? (
              <p className="text-center text-slate-500 italic p-8 bg-white rounded-lg shadow-sm">
                Нет категорий расходов
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {expenseCategories.map((category) => (
                  <li key={category.id} className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
                    {editingCategory && editingCategory.id === category.id ? (
                      <form onSubmit={handleEditSubmit} className="w-full">
                        <div className="flex gap-2 items-center mb-2">
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) =>
                              setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))
                            }
                            className="flex-1 p-1 border border-slate-200 rounded text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2 items-center">
                            <button
                              type="button"
                              className="w-10 h-10 border border-slate-200 rounded cursor-pointer transition-transform duration-200 hover:scale-105"
                              style={{ backgroundColor: editingCategory.color }}
                              onClick={() => setEditShowColorPicker(!editShowColorPicker)}
                            />
                            <input
                              type="text"
                              value={editingCategory.color}
                              onChange={(e) =>
                                setEditingCategory((prev) => (prev ? { ...prev, color: e.target.value } : null))
                              }
                              className="w-20 p-1 border border-slate-200 rounded text-sm"
                            />
                          </div>
                        </div>
                        {editShowColorPicker && (
                          <div className="grid grid-cols-4 gap-2 mb-2 p-2 bg-slate-50 rounded">
                            {colorOptions.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className="w-8 h-8 border border-slate-200 rounded cursor-pointer transition-transform duration-200 hover:scale-110"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setEditingCategory((prev) => (prev ? { ...prev, color } : null))
                                  setEditShowColorPicker(false)
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2 justify-end">
                          <button
                            type="submit"
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-green-700"
                          >
                            Сохранить
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-slate-300"
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border border-slate-200"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setEditingCategory({ id: category.id, name: category.name, color: category.color })
                            }
                            className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-slate-200"
                          >
                            Изменить
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium transition-all duration-200 hover:bg-red-200"
                          >
                            Удалить
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
