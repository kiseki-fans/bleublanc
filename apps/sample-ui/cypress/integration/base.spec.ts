import magicitemsResponse from '../fixtures/magicitems/GET/default.json'
import loginResponse from '../fixtures/login/POST/default.json'

describe('uncategorised tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  describe('Login Page', () => {
    beforeEach(() => {
      cy.intercept('POST', '/login', loginResponse).as('login')

      cy.get('form').within(() => {
        cy.findByLabelText('Username').type('mock-username')
        cy.findByLabelText('Password').type('password{enter}')
      })

      cy.wait('@login')
    })

    it('User should be able to login', () => {
      cy.findByText('heyllo, mock-username').should('be.visible')
    })

    describe('When clicking the button to get magic items', () => {
      it('should render the returned items', () => {
        cy.intercept('GET', '/magicitems', magicitemsResponse)

        cy.findByText('Get Magic Items From API!').click()

        cy.findByText('mock-item-1').should('be.visible')
        cy.findByText('mock-item-2').should('be.visible')
      })
    })
  })
})
