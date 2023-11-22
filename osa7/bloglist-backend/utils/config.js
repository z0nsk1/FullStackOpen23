// Tämä moduuli hoitaa sovellukse ympäristömuuttujien käsittelyn

require('dotenv').config() // .env paketti käyttöön, jotta .env-tiedosto toimii

let PORT = process.env.PORT // portti .env-tiedostosta muuttujaan
let MONGODB_URI = process.env.NODE_ENV === 'test' // Jos projektin suoritusmoodi on test, käytetään testausta varten luotua toista tietokantaa
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI // Tietokannan osoite .env-tiedostosta muuttujaan

// exportataan muuttujat sovelluksen käyttöön
module.exports = {
  MONGODB_URI,
  PORT
}