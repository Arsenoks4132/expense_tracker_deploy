describe("User Registration", () => {
  beforeEach(() => {
    cy.clearAppData()
    cy.visit("/register")
  })

  it("should successfully register a new user", () => {
    // Fill out registration form
    cy.get('input[name="email"]').type("test@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")
    cy.get('input[name="firstName"]').type("Тест")
    cy.get('input[name="lastName"]').type("Пользователь")
    cy.get('input[name="middleName"]').type("Тестович")
    cy.get('input[name="profession"]').type("Тестировщик")
    cy.get('input[name="birthDate"]').type("1990-01-01")

    // Submit form
    cy.get('button[type="submit"]').click()

    // Should redirect to dashboard
    cy.url().should("eq", Cypress.config().baseUrl + "/")

    // Should show user info in header
    cy.contains("Пользователь Тест Т.").should("be.visible")

    // Should show dashboard content
    cy.contains("Панель управления").should("be.visible")
    cy.contains("Текущий баланс").should("be.visible")
  })

  it("should show validation errors for invalid input", () => {
    // Try to submit with empty required fields
    cy.get('button[type="submit"]').click()

    // Should stay on registration page
    cy.url().should("include", "/register")

    // Fill email with invalid format
    cy.get('input[name="email"]').type("invalid-email")
    cy.get('input[name="password"]').type("123") // Too short
    cy.get('input[name="confirmPassword"]').type("456") // Different password
    cy.get('button[type="submit"]').click()

    // Should show validation errors
    cy.contains("Некорректный email").should("be.visible")
    cy.contains("Пароль должен содержать минимум 6 символов").should("be.visible")
    cy.contains("Пароли не совпадают").should("be.visible")
  })

  it("should show error when trying to register with existing email", () => {
    // Try to register with demo user email
    cy.get('input[name="email"]').type("demo@example.com")
    cy.get('input[name="password"]').type("password123")
    cy.get('input[name="confirmPassword"]').type("password123")
    cy.get('input[name="firstName"]').type("Тест")
    cy.get('input[name="lastName"]').type("Пользователь")

    cy.get('button[type="submit"]').click()

    // Should show error message
    cy.contains("Пользователь с таким email уже существует").should("be.visible")
  })

  it("should navigate to login page when clicking login link", () => {
    cy.contains("Войти").click()
    cy.url().should("include", "/login")
  })
})
