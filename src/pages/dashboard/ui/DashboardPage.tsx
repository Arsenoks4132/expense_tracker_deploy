"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useAppContext } from "@/app/providers/AppProvider"
import {
  calculateBalance,
  calculateTotalIncome,
  calculateTotalExpense,
  formatCurrency,
} from "@/shared/lib/calculations"
import type { ChartView } from "@/shared/types"

export default function Dashboard() {
  const { transactions, categories } = useAppContext()
  const [chartView, setChartView] = useState<ChartView>("all")

  const balance = calculateBalance(transactions)
  const totalIncome = calculateTotalIncome(transactions)
  const totalExpense = calculateTotalExpense(transactions)

  // Calculate percentages for the comparison chart
  const incomePercentage =
    totalIncome + totalExpense > 0 ? Math.round((totalIncome / (totalIncome + totalExpense)) * 100) : 0
  const expensePercentage =
    totalIncome + totalExpense > 0 ? Math.round((totalExpense / (totalIncome + totalExpense)) * 100) : 0

  // Group transactions by category for bar charts
  const incomeByCategory = transactions
    .filter((t) => t.type === "income")
    .reduce(
      (acc, transaction) => {
        const { category, amount } = transaction
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += amount
        return acc
      },
      {} as Record<string, number>,
    )

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        const { category, amount } = transaction
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += amount
        return acc
      },
      {} as Record<string, number>,
    )

  // Get category colors
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName)
    return category?.color || "#CBD5E0"
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in-up duration-600">
      <Helmet>
        <title>Панель управления - Учёт финансов</title>
      </Helmet>

      <h2 className="text-xl font-semibold text-slate-900">Панель управления</h2>

      <div className="bg-slate-50 rounded-lg p-6 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-in scale-in duration-500 delay-100">
        <h3 className="text-slate-600 text-base mb-2 transition-colors duration-300">Текущий баланс</h3>
        <p
          className={`text-3xl font-bold mb-0 transition-all duration-300 hover:scale-105 ${
            balance >= 0 ? "text-green-600 animate-pulse" : "text-red-600 animate-bounce"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right duration-600 delay-200">
        <div className="bg-slate-50 rounded-lg p-4 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          <h3 className="text-slate-600 text-sm mb-2 transition-colors duration-300">Доходы</h3>
          <p className="text-xl font-bold text-green-600 transition-all duration-300">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          <h3 className="text-slate-600 text-sm mb-2 transition-colors duration-300">Расходы</h3>
          <p className="text-xl font-bold text-red-600 transition-all duration-300">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-lg animate-in fade-in duration-800 delay-300">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center animate-in slide-in-from-left duration-500 delay-400">
          <h3 className="text-slate-600 text-base mb-0 transition-colors duration-300">Статистика</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Все" },
              { key: "comparison", label: "Сравнение" },
              { key: "income", label: "Доходы" },
              { key: "expense", label: "Расходы" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`px-3 py-2 text-sm font-medium rounded transition-all duration-300 relative overflow-hidden group ${
                  chartView === key
                    ? "bg-blue-600 text-white scale-105 shadow-lg shadow-blue-600/30"
                    : "bg-slate-200 text-slate-700 hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                onClick={() => setChartView(key as ChartView)}
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-full scale-0 group-hover:scale-[200%] transition-transform duration-300" />
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Chart - Bar Chart */}
        {(chartView === "all" || chartView === "comparison") && (
          <div className="flex flex-col items-center mb-8 animate-in fade-in-up duration-600">
            <h4 className="text-slate-600 text-sm text-center mb-4 transition-all duration-300">
              Сравнение доходов и расходов
            </h4>
            {totalIncome === 0 && totalExpense === 0 ? (
              <div className="h-36 flex items-center justify-center bg-slate-100 rounded text-slate-500 w-full max-w-sm mx-auto transition-all duration-300 animate-pulse">
                <p>Нет данных для отображения</p>
              </div>
            ) : (
              <div className="w-full max-w-lg mb-4 animate-in scale-in duration-500">
                <div className="h-8 flex rounded bg-slate-100 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  {totalIncome > 0 && (
                    <div
                      className="bg-green-600 h-full flex items-center justify-center text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis px-2 min-w-[1%] relative group"
                      style={{ width: `${incomePercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {incomePercentage >= 15 && formatCurrency(totalIncome)}
                    </div>
                  )}
                  {totalExpense > 0 && (
                    <div
                      className="bg-red-600 h-full flex items-center justify-center text-white font-bold whitespace-nowrap overflow-hidden text-ellipsis px-2 min-w-[1%] relative group"
                      style={{ width: `${expensePercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {expensePercentage >= 15 && formatCurrency(totalExpense)}
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-2 text-xs animate-in fade-in duration-500 delay-800">
                  {totalIncome > 0 && (
                    <span className="text-green-600 transition-all duration-300 hover:-translate-x-1 hover:font-semibold">
                      Доходы: {formatCurrency(totalIncome)}
                    </span>
                  )}
                  {totalExpense > 0 && (
                    <span className="text-red-600 transition-all duration-300 hover:translate-x-1 hover:font-semibold">
                      Расходы: {formatCurrency(totalExpense)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-600 delay-500">
          {/* Income Bar Chart */}
          {(chartView === "all" || chartView === "income") && (
            <div
              className={`${chartView !== "all" ? "flex flex-col items-center" : ""} animate-in fade-in-up duration-600`}
            >
              <h4 className="text-slate-600 text-sm text-center mb-4 transition-all duration-300">
                Доходы по категориям
              </h4>
              {Object.keys(incomeByCategory).length === 0 ? (
                <div className="h-36 flex items-center justify-center bg-slate-100 rounded text-slate-500 w-full max-w-sm mx-auto transition-all duration-300 animate-pulse">
                  <p>Нет данных для отображения</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full max-w-lg animate-in fade-in-up duration-600">
                  <div className="w-full transition-all duration-300 hover:scale-105">
                    <div className="flex h-8 w-full rounded overflow-hidden bg-slate-100 shadow-inner">
                      {Object.entries(incomeByCategory)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, amount]) => {
                          const percentage = Math.round((amount / totalIncome) * 100)
                          const color = getCategoryColor(category)

                          return (
                            <div
                              key={category}
                              className="h-full transition-all duration-800 relative overflow-hidden group hover:brightness-110 hover:scale-y-110"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color,
                                minWidth: "1%",
                              }}
                              title={`${category}: ${formatCurrency(amount)} (${percentage}%)`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                            </div>
                          )
                        })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 animate-in slide-in-from-bottom duration-500 delay-300">
                    {Object.entries(incomeByCategory)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, amount]) => {
                        const percentage = Math.round((amount / totalIncome) * 100)
                        const color = getCategoryColor(category)

                        return (
                          <div
                            key={category}
                            className="flex items-center gap-2 text-sm transition-all duration-300 p-1 rounded hover:bg-black/5 hover:translate-x-1 group"
                          >
                            <div
                              className="w-3 h-3 rounded-sm flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-slate-700 transition-colors duration-300 group-hover:text-slate-900 group-hover:font-medium">
                              {category}: {formatCurrency(amount)} ({percentage}%)
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Expense Bar Chart */}
          {(chartView === "all" || chartView === "expense") && (
            <div
              className={`${chartView !== "all" ? "flex flex-col items-center" : ""} animate-in fade-in-up duration-600`}
            >
              <h4 className="text-slate-600 text-sm text-center mb-4 transition-all duration-300">
                Расходы по категориям
              </h4>
              {Object.keys(expenseByCategory).length === 0 ? (
                <div className="h-36 flex items-center justify-center bg-slate-100 rounded text-slate-500 w-full max-w-sm mx-auto transition-all duration-300 animate-pulse">
                  <p>Нет данных для отображения</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full max-w-lg animate-in fade-in-up duration-600">
                  <div className="w-full transition-all duration-300 hover:scale-105">
                    <div className="flex h-8 w-full rounded overflow-hidden bg-slate-100 shadow-inner">
                      {Object.entries(expenseByCategory)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, amount]) => {
                          const percentage = Math.round((amount / totalExpense) * 100)
                          const color = getCategoryColor(category)

                          return (
                            <div
                              key={category}
                              className="h-full transition-all duration-800 relative overflow-hidden group hover:brightness-110 hover:scale-y-110"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color,
                                minWidth: "1%",
                              }}
                              title={`${category}: ${formatCurrency(amount)} (${percentage}%)`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                            </div>
                          )
                        })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 animate-in slide-in-from-bottom duration-500 delay-300">
                    {Object.entries(expenseByCategory)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, amount]) => {
                        const percentage = Math.round((amount / totalExpense) * 100)
                        const color = getCategoryColor(category)

                        return (
                          <div
                            key={category}
                            className="flex items-center gap-2 text-sm transition-all duration-300 p-1 rounded hover:bg-black/5 hover:translate-x-1 group"
                          >
                            <div
                              className="w-3 h-3 rounded-sm flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-slate-700 transition-colors duration-300 group-hover:text-slate-900 group-hover:font-medium">
                              {category}: {formatCurrency(amount)} ({percentage}%)
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-in fade-in-up duration-600 delay-600">
        <h3 className="text-slate-600 text-base mb-4 transition-colors duration-300">Последние операции</h3>
        {transactions.length === 0 ? (
          <p className="text-center text-slate-500 italic p-4 animate-pulse">Нет операций. Добавьте первую операцию!</p>
        ) : (
          <ul className="space-y-0">
            {transactions
              .slice(-5)
              .reverse()
              .map((transaction) => (
                <li
                  key={transaction.id}
                  className={`flex justify-between py-3 border-b border-slate-200 last:border-b-0 transition-all duration-300 hover:bg-black/5 hover:translate-x-1 hover:border-l-4 hover:pl-2 animate-in slide-in-from-right duration-500 ${
                    transaction.type === "income"
                      ? "border-l-4 border-l-green-600 pl-2"
                      : "border-l-4 border-l-red-600 pl-2"
                  }`}
                >
                  <div>
                    <strong className="text-slate-900">{transaction.category}</strong>
                    <p className="text-slate-600 text-sm my-1">{transaction.description || "Без описания"}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-base mb-0 ${
                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </p>
                    <small className="text-slate-400 text-xs transition-colors duration-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </small>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
