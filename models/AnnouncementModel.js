const mongoose = require('mongoose')

const announcementSchema = mongoose.Schema({
    announcementDescription: {
        type: String,
        required: [true, 'Please a value']
    },

    announcementImg: {
        type: String, // Assuming you are storing the file path as a string
        default: "/default/image.jpg"
      },
}, {
    timestamps: true
})

module.exports = mongoose.model('Announcement', announcementSchema)