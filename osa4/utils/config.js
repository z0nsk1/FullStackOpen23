// Tämä moduuli hoitaa sovellukse ympäristömuuttujien käsittelyn

require('dotenv').config() // .env paketti käyttöön, jotta .env-tiedosto toimii

let PORT = process.env.PORT // portti .env-tiedostosta muuttujaan
let MONGODB_URI = process.env.MONGODB_URI // Tietokannan osoite .env-tiedostosta muuttujaan

// exportataan muuttujat sovelluksen käyttöön
module.exports = {
  MONGODB_URI,
  PORT
}