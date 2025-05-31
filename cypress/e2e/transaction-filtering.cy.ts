describe("Transaction Filtering", () => {
  beforeEach(() => {
    cy.clearAppData()
    cy.loginAsDemo()

    // Add some test transactions
    cy.visit("/add")

    // Add income transaction
    cy.get("button").contains("Доход").click()
    cy.get('input[name="amount"]').type("5000")
    cy.get('input[name="date"]').type("2025-01-01")
    cy.get('select[name="category"]').select("Зарплата")
    cy.get('textarea[name="description"]').type("Тестовый доход")
    cy.get('button[type="submit"]').click()

    // Add expense transaction
    cy.visit("/add")
    cy.get("button").contains("Расход").click()
    cy.get('input[name="amount"]').type("1000")
    cy.get('input[name="date"]').type("2025-01-15")
    cy.get('select[name="category"]').select("Продукты")
    cy.get('textarea[name="description"]').type("Тестовый расход")
    cy.get('button[type="submit"]').click()

    // Navigate to history page
    cy.visit("/history")
  })

  it("should filter transactions by date range", () => {
    // Initially should show all transactions
    cy.get('[data-testid="transaction-card"]').should("have.length", 2)

    // Filter by date range that includes only the first transaction
    cy.get('input[name="startDate"]').type("2025-01-01")
    cy.get('input[name="endDate"]').type("2025-01-10")

    // Should show only one transaction
    cy.get('[data-testid="transaction-card"]').should("have.length", 1)
    cy.get('[data-testid="transaction-category"]').should("contain", "Зарплата")

    // Clear date filter
    cy.get('input[name="startDate"]').clear()
    cy.get('input[name="endDate"]').clear()

    // Should show all transactions again
    cy.get('[data-testid="transaction-card"]').should("have.length", 2)
  })

  it("should filter transactions by type", () => {
    // Filter by income only
    cy.get('select[name="type"]').select("Доходы")

    // Should show only income transactions
    cy.get('[data-testid="transaction-card"]').should("have.length", 1)
    cy.get('[data-testid="transaction-amount"]').should("contain", "+")
    cy.get('[data-testid="transaction-category"]').should("contain", "Зарплата")

    // Filter by expense only
    cy.get('select[name="type"]').select("Расходы")

    // Should show only expense transactions
    cy.get('[data-testid="transaction-card"]').should("have.length", 1)
    cy.get('[data-testid="transaction-amount"]').should("contain", "-")
    cy.get('[data-testid="transaction-category"]').should("contain", "Продукты")

    // Reset filter
    cy.get('select[name="type"]').select("Все")
    cy.get('[data-testid="transaction-card"]').should("have.length", 2)
  })

  it("should filter transactions by category", () => {
    // Filter by specific category
    cy.get('select[name="category"]').select("Зарплата")

    // Should show only transactions from that category
    cy.get('[data-testid="transaction-card"]').should("have.length", 1)
    cy.get('[data-testid="transaction-category"]').should("contain", "Зарплата")

    // Reset filter
    cy.get('select[name="category"]').select("Все")
    cy.get('[data-testid="transaction-card"]').should("have.length", 2)
  })

  it("should sort transactions correctly", () => {
    // Sort by amount descending
    cy.get('select[name="sort"]').select("По сумме (по убыванию)")

    // First transaction should be the higher amount
    cy.get('[data-testid="transaction-card"]')
      .first()
      .find('[data-testid="transaction-amount"]')
      .should("contain", "5 000")

    // Sort by amount ascending
    cy.get('select[name="sort"]').select("По сумме (по возрастанию)")

    // First transaction should be the lower amount
    cy.get('[data-testid="transaction-card"]')
      .first()
      .find('[data-testid="transaction-amount"]')
      .should("contain", "1 000")
  })

  it("should show no results message when no transactions match filters", () => {
    // Set date range that excludes all transactions
    cy.get('input[name="startDate"]').type("2024-01-01")
    cy.get('input[name="endDate"]').type("2024-12-31")

    // Should show no results message
    cy.contains("Нет операций, соответствующих фильтрам").should("be.visible")
    cy.get('[data-testid="transaction-card"]').should("not.exist")
  })

  it("should edit and delete transactions", () => {
    // Click edit button on first transaction
    cy.get('[data-testid="edit-button"]').first().click()

    // Should show edit form
    cy.contains("Редактировать операцию").should("be.visible")

    // Edit the amount
    cy.get('input[name="amount"]').clear().type("6000")
    cy.get('button[type="submit"]').click()

    // Should update the transaction
    cy.get('[data-testid="transaction-amount"]').should("contain", "6 000")

    // Delete a transaction
    cy.get('[data-testid="delete-button"]').first().click()

    // Should have one less transaction
    cy.get('[data-testid="transaction-card"]').should("have.length", 1)
  })
})
