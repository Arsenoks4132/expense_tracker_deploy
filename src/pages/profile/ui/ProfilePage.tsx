"use client"

import type React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "@/app/providers/AppProvider"

export default function Profile() {
  const { transactions, categories, auth, updateUserProfile, clearAllData, logout } = useAppContext()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(
    auth.user?.profile || {
      firstName: "",
      lastName: "",
      middleName: "",
      profession: "",
      birthDate: "",
      photoUrl: "",
    },
  )

  const handleExportData = () => {
    const data = {
      transactions,
      categories,
      userProfile: auth.user?.profile,
      exportDate: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `finance-tracker-export-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleClearData = () => {
    if (window.confirm("Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.")) {
      clearAllData()
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserProfile(editedProfile)
    setIsEditing(false)
  }

  if (!auth.user) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Профиль - Учёт финансов</title>
      </Helmet>
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Профиль</h2>

        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          {isEditing ? (
            <form onSubmit={handleProfileSubmit} className="w-full">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={editedProfile.photoUrl || "/placeholder.svg?height=100&width=100"}
                    alt="Фото профиля"
                    className="w-25 h-25 rounded-full object-cover border-3 border-slate-200"
                  />
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <label htmlFor="photoUrl" className="text-sm font-medium text-slate-700">
                      URL фото:
                    </label>
                    <input
                      type="text"
                      id="photoUrl"
                      name="photoUrl"
                      value={editedProfile.photoUrl}
                      onChange={handleProfileChange}
                      className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="firstName" className="font-medium text-slate-700 text-sm">
                        Имя:
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={editedProfile.firstName}
                        onChange={handleProfileChange}
                        className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="lastName" className="font-medium text-slate-700 text-sm">
                        Фамилия:
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={editedProfile.lastName}
                        onChange={handleProfileChange}
                        className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="middleName" className="font-medium text-slate-700 text-sm">
                      Отчество:
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      value={editedProfile.middleName || ""}
                      onChange={handleProfileChange}
                      className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="profession" className="font-medium text-slate-700 text-sm">
                        Профессия:
                      </label>
                      <input
                        type="text"
                        id="profession"
                        name="profession"
                        value={editedProfile.profession}
                        onChange={handleProfileChange}
                        className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="birthDate" className="font-medium text-slate-700 text-sm">
                        Дата рождения:
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={editedProfile.birthDate}
                        onChange={handleProfileChange}
                        className="p-2 border border-slate-200 rounded text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded font-medium transition-all duration-200 hover:bg-green-700 hover:-translate-y-0.5"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium transition-all duration-200 hover:bg-slate-300 hover:-translate-y-0.5"
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <img
                  src={auth.user.profile.photoUrl || "/placeholder.svg?height=100&width=100"}
                  alt="Фото профиля"
                  className="w-25 h-25 rounded-full object-cover border-3 border-slate-200"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {auth.user.profile.lastName} {auth.user.profile.firstName} {auth.user.profile.middleName || ""}
                  </h3>
                  <p className="text-blue-600 font-medium mb-1">{auth.user.profile.profession}</p>
                  <p className="text-slate-600 text-sm">
                    Дата рождения: {new Date(auth.user.profile.birthDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5"
                >
                  Редактировать
                </button>
              </div>
            </>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="mb-4 text-slate-900 text-lg font-medium">Статистика</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-md">
              <span className="block text-slate-600 text-sm mb-2">Всего операций</span>
              <span className="block text-slate-900 text-2xl font-semibold">{transactions.length}</span>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-md">
              <span className="block text-slate-600 text-sm mb-2">Категорий</span>
              <span className="block text-slate-900 text-2xl font-semibold">{categories.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="mb-4 text-slate-900 text-lg font-medium">Действия</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleExportData}
              className="bg-blue-600 text-white p-3 rounded-md font-medium transition-all duration-200 hover:bg-blue-700 hover:-translate-y-0.5"
            >
              Экспортировать данные
            </button>
            <button
              onClick={handleClearData}
              className="bg-red-600 text-white p-3 rounded-md font-medium transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5"
            >
              Очистить все данные
            </button>
            <button
              onClick={handleLogout}
              className="bg-slate-600 text-white p-3 rounded-md font-medium transition-all duration-200 hover:bg-slate-700 hover:-translate-y-0.5"
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="mb-4 text-slate-900 text-lg font-medium">О приложении</h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            Это приложение для учёта доходов и расходов разработано как MVP (минимально жизнеспособный продукт). В
            будущих версиях планируется добавить синхронизацию данных и расширенную аналитику.
          </p>
          <p className="text-slate-600 text-sm font-medium">Версия 1.0.0</p>
        </div>
      </div>
    </>
  )
}
