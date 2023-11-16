describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`) // Tyhjennetään tietokanta
    const testUser = {
      username: 'Tester',
      name: 'T. Tester',
      password: 'testingpw'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, testUser) // Luodaan käyttäjä tietokantaan
    cy.visit('') // Mennään kirjautumissivulle
  })

  it('Login form is shown', function() {
    cy.contains('Blogsapp')
    cy.contains('Log in to blogsapp')
    cy.contains('username:')
    cy.contains('password:')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('Tester')
      cy.get('#password').type('testingpw')
      cy.get('#login-button').click()

      cy.contains('T. Tester logged in')
      cy.get('.status')
        .should('contain', 'Login successful: Tester logged in')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('Tester')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Log in to blogsapp')
      cy.get('.error')
        .should('contain', 'Login failed: Invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('Tester')
      cy.get('#password').type('testingpw')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('T. Tester logged in')
      cy.contains('Create a new blog').click()

      cy.get('#title').type('Test blog')
      cy.get('#author').type('Tester')
      cy.get('#url').type('www.example.com')
      cy.get('#create').click()

      cy.get('.status')
        .should('contain', 'a new blog added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.contains('Test blog Tester')
      cy.contains('view')
    })
  })
})