// Tämä moduuli hoitaa blogin skeeman luomisen (skeema kertoo mongooselle, miten blogioliot tulee tallentaa tietokantaan)

const mongoose = require('mongoose')
const config = require('../utils/config')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // muutetaan blogiolion kentän _id nimi muotoon id ja muutetaan se merkkijonoksi testejä varten (MongoDB luoma _id-kenttä on olio)
    delete returnedObject._id // Edellisen jälkeen poistetaan vielä vanha _id kenttä
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)