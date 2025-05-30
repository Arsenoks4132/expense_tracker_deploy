"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "@/app/providers/AppProvider"

export default function Register() {
  const { register, auth } = useAppContext()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    middleName: "",
    profession: "",
    birthDate: "",
    photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email обязателен"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Некорректный email"
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен"
    } else if (formData.password.length < 6) {
      newErrors.password = "Пароль должен содержать минимум 6 символов"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают"
    }

    if (!formData.firstName) {
      newErrors.firstName = "Имя обязательно"
    }

    if (!formData.lastName) {
      newErrors.lastName = "Фамилия обязательна"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const success = await register(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        profession: formData.profession,
        birthDate: formData.birthDate,
        photoUrl: formData.photoUrl,
      })

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
        <title>Регистрация - Учёт финансов</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h1 className="text-center mb-8 text-slate-900 text-2xl font-semibold">Регистрация</h1>

          {auth.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm text-center">{auth.error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium text-slate-700 text-sm">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`p-3 border rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-3 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                }`}
                required
              />
              {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="font-medium text-slate-700 text-sm">
                  Пароль*
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`p-3 border rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-3 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                  required
                />
                {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="font-medium text-slate-700 text-sm">
                  Подтверждение пароля*
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`p-3 border rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-3 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                  required
                />
                {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="font-medium text-slate-700 text-sm">
                  Имя*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`p-3 border rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-3 ${
                    errors.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                  required
                />
                {errors.firstName && <p className="text-red-600 text-xs">{errors.firstName}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="font-medium text-slate-700 text-sm">
                  Фамилия*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`p-3 border rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-3 ${
                    errors.lastName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                  required
                />
                {errors.lastName && <p className="text-red-600 text-xs">{errors.lastName}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="middleName" className="font-medium text-slate-700 text-sm">
                Отчество
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="p-3 border border-slate-200 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="profession" className="font-medium text-slate-700 text-sm">
                  Профессия
                </label>
                <input
                  type="text"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="p-3 border border-slate-200 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="birthDate" className="font-medium text-slate-700 text-sm">
                  Дата рождения
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="p-3 border border-slate-200 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="photoUrl" className="font-medium text-slate-700 text-sm">
                URL фото профиля
              </label>
              <input
                type="text"
                id="photoUrl"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                className="p-3 border border-slate-200 rounded-md text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-3.5 px-4 rounded-md text-base font-semibold transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-600 text-sm">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
