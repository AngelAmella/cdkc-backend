const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    UserName:{
        type: String,
        required: [true, 'Please add your Name']
    },
    name: {
        type: String,
        required: [true, 'Please add your Name']
    },
    role: {
        type: String,
        required: [true, 'Please add your Role']
    },
    email: {
        type: String,
        required: [true, 'Please add your Email']
    },
    password: {
        type: String,
        required: [true, 'Please add your Password']
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Admin', adminSchema)