"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "@/app/providers/AppProvider"
import type { TransactionType } from "@/shared/types"

export default function AddTransaction() {
  const navigate = useNavigate()
  const { addTransaction, categories } = useAppContext()

  const [formData, setFormData] = useState({
    type: "income" as TransactionType,
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
  })

  const [errors, setErrors] = useState({
    amount: "",
    category: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "amount" || name === "category") {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let isValid = true
    const newErrors = { amount: "", category: "" }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Введите корректную сумму"
      isValid = false
    }

    if (!formData.category) {
      newErrors.category = "Выберите категорию"
      isValid = false
    }

    if (!isValid) {
      setErrors(newErrors)
      return
    }

    addTransaction({
      type: formData.type,
      amount: Number.parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      description: formData.description,
    })

    navigate("/")
  }

  const filteredCategories = categories.filter((category) => category.type === formData.type)

  return (
    <>
      <Helmet>
        <title>Добавить операцию - Учёт финансов</title>
      </Helmet>
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">Добавить операцию</h2>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md">
          <div className="flex mb-6 rounded-lg overflow-hidden border border-slate-200">
            <button
              type="button"
              className={`flex-1 py-3 px-4 font-medium transition-all duration-200 ${
                formData.type === "income" ? "bg-green-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, type: "income" }))}
            >
              Доход
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 font-medium transition-all duration-200 ${
                formData.type === "expense" ? "bg-red-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, type: "expense" }))}
            >
              Расход
            </button>
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="block mb-2 font-medium text-slate-700">
              Сумма*
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              className={`w-full p-3 border rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-3 focus:scale-105 ${
                errors.amount
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
              }`}
              min="0"
              step="0.01"
              required
            />
            {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="date" className="block mb-2 font-medium text-slate-700">
              Дата*
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 focus:scale-105"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="block mb-2 font-medium text-slate-700">
              Категория*
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-3 border rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-3 ${
                errors.category
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
              }`}
              required
            >
              <option value="">Выберите категорию</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-medium text-slate-700">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-md text-base resize-vertical min-h-[80px] transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 focus:scale-105"
              placeholder="Необязательно"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-md text-base font-semibold transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Добавить
          </button>
        </form>
      </div>
    </>
  )
}
