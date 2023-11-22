// Tämä moduuli hoitaa sovelluksen konsolitulostukset.
// Moduulissa on erilliset funktiot virheiden ja loggaamista varten olevien infojen tulostukseen
// Moduuli helpottaa konsolilogaamista ja mikäli tulostukset halutaan tallentaa oikeaan lokiin, riittää tämän moduulin muokkaaminen

const info = (...params) => {
  console.log(...params)
}

const errorInfo = (...params) => {
  console.log(...params)
}

module.exports = {
  info, errorInfo
}