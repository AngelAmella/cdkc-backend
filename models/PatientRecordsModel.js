const mongoose = require('mongoose')

const medicalHistorySchema = mongoose.Schema({
    medicalId: {
        type: mongoose.Schema.Types.ObjectId
    },
    allergies: {
        type: String,
        required: [true, 'Please add a Value']
    },
    diagnosis: {
        type: String,
        required: [true, 'Please add a Value']
    },
    bloodPressure: {
        type: String,
        required: [true, 'Please add a Value']
    },
    temperature: {
        type: String,
        required: [true, 'Please add a Value']
    },
    surgeries: {
        type: String,
        required: [true, 'Please add a Value']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const patientRecordSchema = mongoose.Schema({
    patientName: {
        type: String,
        required: [true, 'Please add a Name']
    },
    weight: {
        type: String,
        required: [true, 'Please add a Value']
    },
    height: {
        type: String,
        required: [true, 'Please add a Value']
    },
    age: {
        type: String,
        required: [true, 'Please add a Value']
    },
    sex: {
        type: String,
        required: [true, 'Please add a Value']
    },
    medicalHistory: [medicalHistorySchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('PatientRecord', patientRecordSchema);