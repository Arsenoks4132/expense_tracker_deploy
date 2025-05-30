"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "@/app/providers/AppProvider"

export default function Login() {
  const { login, auth } = useAppContext()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        navigate("/")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Вход - Учёт финансов</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h1 className="text-center mb-8 text-slate-900 text-2xl font-semibold">Вход в систему</h1>

          {auth.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm text-center">{auth.error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium text-slate-700 text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border border-slate-200 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-medium text-slate-700 text-sm">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="p-3 border border-slate-200 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-3.5 px-4 rounded-md text-base font-semibold transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-600 text-sm">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Зарегистрироваться
            </Link>
          </p>

          <div className="mt-6 p-4 bg-slate-50 rounded-md border-l-4 border-l-blue-600">
            <p className="font-semibold text-slate-900 text-sm mb-1">Демо-доступ:</p>
            <p className="text-slate-700 text-sm mb-1">Email: demo@example.com</p>
            <p className="text-slate-700 text-sm">Пароль: password123</p>
          </div>
        </div>
      </div>
    </>
  )
}
