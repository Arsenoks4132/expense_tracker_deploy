import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import TransactionCard from "./TransactionCard"
import type { Transaction } from "@/shared/types"

const mockTransaction: Transaction = {
  id: "1",
  type: "income",
  amount: 1000,
  category: "Зарплата",
  date: "2025-01-15",
  description: "Основная зарплата",
}

const mockExpenseTransaction: Transaction = {
  id: "2",
  type: "expense",
  amount: 500,
  category: "Продукты",
  date: "2025-01-16",
  description: "Покупки в магазине",
}

describe("TransactionCard", () => {
  it("renders transaction information correctly", () => {
    render(<TransactionCard transaction={mockTransaction} />)

    expect(screen.getByTestId("transaction-category")).toHaveTextContent("Зарплата")
    expect(screen.getByTestId("transaction-description")).toHaveTextContent("Основная зарплата")
    expect(screen.getByTestId("transaction-amount")).toHaveTextContent("+ 1 000 ₽")
    expect(screen.getByTestId("transaction-date")).toHaveTextContent("15.01.2025")
  })

  it("renders income transaction with correct styling", () => {
    render(<TransactionCard transaction={mockTransaction} />)

    const card = screen.getByTestId("transaction-card")
    const amount = screen.getByTestId("transaction-amount")

    expect(card).toHaveClass("border-l-green-600")
    expect(amount).toHaveClass("text-green-600")
    expect(amount).toHaveTextContent("+")
  })

  it("renders expense transaction with correct styling", () => {
    render(<TransactionCard transaction={mockExpenseTransaction} />)

    const card = screen.getByTestId("transaction-card")
    const amount = screen.getByTestId("transaction-amount")

    expect(card).toHaveClass("border-l-red-600")
    expect(amount).toHaveClass("text-red-600")
    expect(amount).toHaveTextContent("-")
  })

  it("renders default description when description is empty", () => {
    const transactionWithoutDescription = { ...mockTransaction, description: "" }
    render(<TransactionCard transaction={transactionWithoutDescription} />)

    expect(screen.getByTestId("transaction-description")).toHaveTextContent("Без описания")
  })

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = vi.fn()
    render(<TransactionCard transaction={mockTransaction} onEdit={onEdit} />)

    const editButton = screen.getByTestId("edit-button")
    fireEvent.click(editButton)

    expect(onEdit).toHaveBeenCalledWith(mockTransaction)
  })

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn()
    render(<TransactionCard transaction={mockTransaction} onDelete={onDelete} />)

    const deleteButton = screen.getByTestId("delete-button")
    fireEvent.click(deleteButton)

    expect(onDelete).toHaveBeenCalledWith(mockTransaction.id)
  })

  it("does not render action buttons when handlers are not provided", () => {
    render(<TransactionCard transaction={mockTransaction} />)

    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument()
    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument()
  })

  it("renders only edit button when only onEdit is provided", () => {
    const onEdit = vi.fn()
    render(<TransactionCard transaction={mockTransaction} onEdit={onEdit} />)

    expect(screen.getByTestId("edit-button")).toBeInTheDocument()
    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument()
  })

  it("renders only delete button when only onDelete is provided", () => {
    const onDelete = vi.fn()
    render(<TransactionCard transaction={mockTransaction} onDelete={onDelete} />)

    expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument()
    expect(screen.getByTestId("delete-button")).toBeInTheDocument()
  })
})
