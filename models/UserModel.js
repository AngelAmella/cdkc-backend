const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    FirstName: {
        type: String,
        required: [true, 'Please add your Name'],
    },
    MiddleName: {
        type: String,
        required: [true, 'Please add your Name'],
    },
    LastName: {
        type: String,
        required: [true, 'Please add your Name'],
    },
    birthday: {
        type: String,
        required: [true, 'Please add your Birthday']
    },
    sex: {
        type: String,
        required: [true, 'Please add your Sex']
    },
    contactNum: {
        type: String,
        required: [true, 'Please add your Contact Number'],
    },
    houseNum: {
        type: String,
        required: [true, 'Please add your Address']
    },
    street: {
        type: String,
        required: [true, 'Please add your Address']
    },
    brgy: {
        type: String,
        required: [true, 'Please add your Address']
    },
    city: {
        type: String,
        required: [true, 'Please add your Address']
    },
    prov: {
        type: String,
        required: [true, 'Please add your Address']
    },
    email: {
        type: String,
        required: [true, 'Please add your Email']
    },
    UserName: {
        type: String,
        required: [true, 'Please add your UserName'],
    },
    password: {
        type: String,
        required: [true, 'Please add your Password']
    },
    confirmpassword: {
        type: String,
        required: [true, 'Please add your Password']
    },
    resetPasswordToken: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)

