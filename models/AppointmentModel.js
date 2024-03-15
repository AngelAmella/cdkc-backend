const mongoose = require('mongoose')

const appointmentSchema = mongoose.Schema({
    service: {
        type: String,
        default: 'Nephrology Consultation'
    },
    UserName: {
        type: String,
        required: [true, 'Please enter Username']
    },
    appointmentDate: {
        type: String,
        required: [true, 'Please enter Date']
    },
    appointmentTime: {
        type: String,
        required: [true, 'Please enter Time Slot']
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Denied', 'Cancelled'],
        default: 'Pending' 
      }
}, {
    timestamps: true
})

module.exports = mongoose.model('Appointment', appointmentSchema)