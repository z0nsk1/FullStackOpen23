// Tämä moduuli hoitaa blogin skeeman luomisen (skeema kertoo mongooselle, miten blogioliot tulee tallentaa tietokantaan)

const mongoose = require('mongoose')
const config = require('../utils/config')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

module.exports = mongoose.model('Blog', blogSchema)