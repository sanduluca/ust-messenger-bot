const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    psid: {
        type: String,
        required: true,
        index: true
    },
    firstName: String,
    lastName: String,
    locale: {
        type: String,
        default: "en_US"
    },
    timezone: String,
    gender: {
        type: String,
        default: "neutral"
    },
})

module.exports = mongoose.model('users', UserSchema)