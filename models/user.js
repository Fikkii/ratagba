const mongoose = require('mongoose')

  const ambassadorSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    surname: {type: String, required: true},
    phone: {type: String, required: true},
    age: {type: String, required: true},
    church: {type: String, required: true},
    rank: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String , required: true, unique: true},
    role: {type: String}
  })

  const gallerySchema = new mongoose.Schema({
    src: {type: String, required: true},
    title: {type: String, required: true},
  })

  const liveSchema = new mongoose.Schema({
    src: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String},
    date: {type: Date, default: new Date}
  })

  const manualSchema = new mongoose.Schema({
    src: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String},
    date: {type: Date, default: new Date}
  })

  const eventSchema = new mongoose.Schema({
    src: {type: String},
    title: {type: String, required: true},
    date: {type: String, required: true}
  })

const Manual = mongoose.model('Manual', manualSchema)
const Gallery = mongoose.model('Gallery', gallerySchema)
const Live = mongoose.model('Live', liveSchema)
const Event = mongoose.model('Event', eventSchema)
const Ambassador = mongoose.model('Ambassador', ambassadorSchema)

module.exports = {
  Gallery,
  Manual,
  Ambassador,
  Live,
  Event
}