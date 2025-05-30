import { Routes, Route, Navigate } from "react-router-dom"
import { AppProvider, useAppContext } from "@/app/providers/AppProvider"
import Layout from "@/widgets/layout/ui/Layout"
import DashboardPage from "@/pages/dashboard/ui/DashboardPage"
import HistoryPage from "@/pages/history/ui/HistoryPage"
import AddTransactionPage from "@/pages/add-transaction/ui/AddTransactionPage"
import CategoriesPage from "@/pages/categories/ui/CategoriesPage"
import ProfilePage from "@/pages/profile/ui/ProfilePage"
import LoginPage from "@/pages/login/ui/LoginPage"
import RegisterPage from "@/pages/register/ui/RegisterPage"

function AppRoutes() {
  const { auth } = useAppContext()

  if (!auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/add" element={<AddTransactionPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App
