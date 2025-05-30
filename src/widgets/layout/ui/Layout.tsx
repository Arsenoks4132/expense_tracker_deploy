"use client"

import type React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Clock, PlusCircle, Tag, User, LogOut } from "lucide-react"
import { useAppContext } from "@/app/providers/AppProvider"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { auth, logout } = useAppContext()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto px-4 pb-16 animate-in fade-in duration-600">
      <header className="py-4 flex justify-between items-center border-b border-slate-200 transition-all duration-300 hover:border-slate-300">
        <h1 className="text-xl font-semibold text-slate-900">Учёт финансов</h1>
        {auth.isAuthenticated && auth.user && (
          <div className="flex items-center gap-2 text-sm text-slate-600 transition-all duration-300 hover:-translate-x-0.5">
            <img
              src={auth.user.profile.photoUrl || "/placeholder.svg"}
              alt="Фото профиля"
              className="w-8 h-8 rounded-full object-cover transition-all duration-300 border-2 border-transparent hover:scale-110 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
            />
            <span>
              {auth.user.profile.lastName} {auth.user.profile.firstName}{" "}
              {auth.user.profile.middleName ? auth.user.profile.middleName.charAt(0) + "." : ""}
            </span>
            <button
              onClick={handleLogout}
              className="p-1 text-slate-400 hover:text-red-500 hover:rotate-180 transition-all duration-300 rounded-full relative overflow-hidden group"
              title="Выйти"
            >
              <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              <LogOut size={16} className="relative z-10" />
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 py-4 mb-16 animate-in fade-in duration-800 delay-200">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-white/95 backdrop-blur-md py-2 shadow-lg shadow-black/10 z-10 animate-in slide-in-from-bottom duration-600 delay-400">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 text-xs min-w-[60px] text-center transition-all duration-300 rounded-lg relative overflow-hidden group ${
            isActive("/")
              ? "text-blue-600 bg-blue-50 scale-105"
              : "text-slate-600 hover:text-blue-600 hover:-translate-y-1"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Home size={20} className="relative z-10" />
          <span className="relative z-10">Главная</span>
        </Link>

        <Link
          to="/history"
          className={`flex flex-col items-center p-2 text-xs min-w-[60px] text-center transition-all duration-300 rounded-lg relative overflow-hidden group ${
            isActive("/history")
              ? "text-blue-600 bg-blue-50 scale-105"
              : "text-slate-600 hover:text-blue-600 hover:-translate-y-1"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Clock size={20} className="relative z-10" />
          <span className="relative z-10">История</span>
        </Link>

        <Link
          to="/add"
          className={`flex flex-col items-center p-2 text-xs min-w-[60px] text-center transition-all duration-300 rounded-lg relative overflow-hidden group ${
            isActive("/add")
              ? "text-blue-600 bg-blue-50 scale-105"
              : "text-slate-600 hover:text-blue-600 hover:-translate-y-1"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <PlusCircle size={20} className="relative z-10" />
          <span className="relative z-10">Добавить</span>
        </Link>

        <Link
          to="/categories"
          className={`flex flex-col items-center p-2 text-xs min-w-[60px] text-center transition-all duration-300 rounded-lg relative overflow-hidden group ${
            isActive("/categories")
              ? "text-blue-600 bg-blue-50 scale-105"
              : "text-slate-600 hover:text-blue-600 hover:-translate-y-1"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Tag size={20} className="relative z-10" />
          <span className="relative z-10">Категории</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center p-2 text-xs min-w-[60px] text-center transition-all duration-300 rounded-lg relative overflow-hidden group ${
            isActive("/profile")
              ? "text-blue-600 bg-blue-50 scale-105"
              : "text-slate-600 hover:text-blue-600 hover:-translate-y-1"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <User size={20} className="relative z-10" />
          <span className="relative z-10">Профиль</span>
        </Link>
      </nav>
    </div>
  )
}
