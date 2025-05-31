/// <reference types="cypress" />

// Custom commands for Cypress
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login with demo credentials
       * @example cy.loginAsDemo()
       */
      loginAsDemo(): Chainable<void>

      /**
       * Custom command to clear all application data
       * @example cy.clearAppData()
       */
      clearAppData(): Chainable<void>
    }
  }
}

Cypress.Commands.add("loginAsDemo", () => {
  cy.visit("/login")
  cy.get('input[name="email"]').type("demo@example.com")
  cy.get('input[name="password"]').type("password123")
  cy.get('button[type="submit"]').click()
  cy.url().should("eq", Cypress.config().baseUrl + "/")
})

Cypress.Commands.add("clearAppData", () => {
  cy.window().then((win) => {
    win.localStorage.clear()
    win.sessionStorage.clear()
  })
})

export {}
