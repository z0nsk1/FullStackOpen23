describe('Blog app', function() {
  // Itseluotu apukomento, jolla luodaan uusi blogi
  Cypress.Commands.add('createBlog', ({ title, author, url }) => {
    cy.request({
      url: `${Cypress.env('BACKEND')}/blogs`,
      method: 'POST',
      body: { title, author, url },
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogsappUser')).token}`
      }
    })
    cy.visit('')
  })

  // Itseluotu apukomento, jolla voidaan luoda uusi käyttäjä ja kirjautua sillä sisään
  Cypress.Commands.add('newUserLogin', ({ username, name, password }) => {
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, { username, name, password })
    cy.request('POST', `${Cypress.env('BACKEND')}/login`, { username, password }).then(res => {
      localStorage.setItem('loggedBlogsappUser', JSON.stringify(res.body))
      cy.visit('')
    })
  })

  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`) // Tyhjennetään tietokanta
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, { username: 'Tester', name: 'T. Tester', password: 'testingpw' }) // Luodaan käyttäjä tietokantaan
    cy.visit('') // Mennään kirjautumissivulle
  })

  // Tarkistetaan, että kirjautumissivun kaikki elementit (tekstit) on näkyvissä
  it('Login form is shown', function() {
    cy.contains('Blogsapp')
    cy.contains('Log in to blogsapp')
    cy.contains('username:')
    cy.contains('password:')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('Tester') // username-kenttään "Tester"
      cy.get('#password').type('testingpw') // password-kenttään "testingpw"
      cy.get('#login-button').click() // Klikataan kirjautumispainiketta

      cy.contains('T. Tester logged in') // Tarkistetaan, että kirjautuminen onnistui kirjautumistekstin...
      cy.get('.status') // ...ja oikeanlaisen statusviestin avulla
        .should('contain', 'Login successful: Tester logged in')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('Tester') // username-kenttään "Tester"
      cy.get('#password').type('salasana') // username-kenttään väärä salasana "salasana"
      cy.get('#login-button').click() // Kirjaudutaan

      cy.contains('Log in to blogsapp') // Pitäisi olla edelleen näkyvissä kirjautumissivun teksti
      cy.get('.error') // Virheilmoituksen pitäisi ilmoittaa virheellisestä käyttäjätunnuksesta tai salasanasta
        .should('contain', 'Login failed: Invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    // Kirjautuminen ennen jokaista testiä
    beforeEach(function() {
      cy.get('#username').type('Tester')
      cy.get('#password').type('testingpw')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('T. Tester logged in') // Tarkistetaan, että ollaan kirjautuneina
      cy.get('#showform').click() // Avataan blogin luontilomake

      cy.get('#title').type('Test blog') // title-kenttään "Test blog"
      cy.get('#author').type('Tester') // author-kenttään "Tester"
      cy.get('#url').type('www.example.com') // url-kenttään "www.example.com"
      cy.get('#create').click() // Luodaan blogi

      cy.get('.status') // Tarkistetaan, että tuli oikea statusviesti
        .should('contain', 'a new blog added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.contains('Test blog Tester') // Tarkistetaan, että uusi blogi ja author tulostuivat blogilistaan
      cy.contains('view')
    })

    it('User can like a blog', function() {
      // Uuden blogin luonti
      cy.contains('T. Tester logged in')
      cy.get('#showform').click()
      cy.get('#title').type('Test title')
      cy.get('#author').type('Tester')
      cy.get('#url').type('www.example.com')
      cy.get('#create').click()

      cy.get('#view').click() // Avataan blogin lisätiedot
      cy.contains('likes: 0') // Tarkistetaan, että uudella blogilla on 0 tykkäystä
      cy.get('#like').click() // Tykätään blogista

      cy.get('.status') // Tarkistetaan, että tuli oikeanlainen status-viesti
        .should('contain', 'You liked the blog "Test title"')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('#view').click() // Avataan blogin lisätiedot uudestaan
      cy.contains('likes: 1') // Ja tarkistetaan, että tykkäyksien määrä on noussut yhdellä
    })
  })

  describe('Owner of the blog', function() {
    beforeEach(function() {
      cy.newUserLogin({ username: 'ExampleUser', name: 'User user', password: 'examplepassword' }) // Tehdään uusi käyttäjä kirjaudutaan sillä sisään
      cy.createBlog({ title: 'Another test blog', author: 'User', url: 'www' }) // Luodaan uusi blogi
    })

    it('can remove the blog', function() {
      cy.contains('Another test blog User') // Tarkistetaan, että blogi on sivulla
      cy.get('#view').click() // Klikataan lisätietoja
      cy.get('#remove').click() // Klikataan remove-painiketta
      cy.get('.status')
        .should('contain', 'Blog "Another test blog" was deleted successfully') // Tarkistetaan oikeanlaisen statusviestin olemassaolo
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('html').should('not.contain', 'Another test blog User') // Nyt blogia ei pitäisi enää olla sivulla
    })

    it('can only see the remove-button', function() {
      // Kirjaudutaan ensin toisella käyttäjällä, jolla ei ole luotu blogia
      cy.request('POST', `${Cypress.env('BACKEND')}/login`, { username: 'Tester', password: 'testingpw' }).then(res => {
        localStorage.setItem('loggedBlogsappUser', JSON.stringify(res.body))
        cy.visit('')
      })
      cy.get('#view').click() // Avataan blogin tarkemmat tiedot
      cy.get('#remove').should('not.be.visible') // Koska käyttäjä ei ole blogin omistaja, remove-painikkeen ei pitäisi olla näkyvissä

      // Kirjaudutaan sivulle käyttäjällä, joka on tietokannassa olevan blogin omistaja
      cy.request('POST', `${Cypress.env('BACKEND')}/login`, { username: 'ExampleUser', password: 'examplepassword' }).then(res => {
        localStorage.setItem('loggedBlogsappUser', JSON.stringify(res.body))
        cy.visit('')
      })
      cy.get('#view').click() // Avataan blogin tarkemmat tiedot
      cy.get('#remove').should('be.visible') // Nyt remove-painikkeen pitäisi näkyä käyttäjälle
    })
  })
})