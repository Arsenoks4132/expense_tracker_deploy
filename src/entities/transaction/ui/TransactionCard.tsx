"use client"

import type { Transaction } from "@/shared/types"
import { formatCurrency, formatDate } from "@/shared/lib/calculations"

interface TransactionCardProps {
  transaction: Transaction
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void
}

export default function TransactionCard({ transaction, onEdit, onDelete }: TransactionCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        transaction.type === "income" ? "border-l-4 border-l-green-600" : "border-l-4 border-l-red-600"
      }`}
      data-testid="transaction-card"
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex-1">
          <strong className="text-slate-900 text-base" data-testid="transaction-category">
            {transaction.category}
          </strong>
          <p className="text-slate-600 text-sm my-1" data-testid="transaction-description">
            {transaction.description || "Без описания"}
          </p>
          <small className="text-slate-400 text-xs" data-testid="transaction-date">
            {formatDate(transaction.date)}
          </small>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p
            className={`font-semibold text-base mb-0 ${
              transaction.type === "income" ? "text-green-600" : "text-red-600"
            }`}
            data-testid="transaction-amount"
          >
            {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
          </p>
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-all duration-200 text-sm"
                  onClick={() => onEdit(transaction)}
                  aria-label="Редактировать"
                  data-testid="edit-button"
                >
                  ✎
                </button>
              )}
              {onDelete && (
                <button
                  className="text-red-600 hover:bg-red-50 p-1 rounded transition-all duration-200 text-sm"
                  onClick={() => onDelete(transaction.id)}
                  aria-label="Удалить"
                  data-testid="delete-button"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
