const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  name: String,
  password: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // muutetaan user-olion kentän _id nimi muotoon id ja muutetaan se merkkijonoksi testejä varten (MongoDB luoma _id-kenttä on olio)
    delete returnedObject._id // edellisen jälkeen poistetaan vielä vanha _id kenttä
    delete returnedObject.__v // poistetaan mongoose luoma, meille turha versiokenttä
  }
})

module.exports = mongoose.model('User', userSchema)