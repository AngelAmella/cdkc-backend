const asyncHandler = require('express-async-handler')
const Records = require('../models/PatientRecordsModel')


// Get All Data for One Patient Record
// @route GET /api/records/get-medical-history/:id
// @access Public
const getAllMedical = asyncHandler(async (req, res) => {
    try {
        // Find the patient record by ID
        const record = await Records.findById(req.params.id);

        if (!record) {
            res.status(404).json({ error: 'Record not found' });
            return;
        }

        const medicalData = record.medicalHistory || [];

        res.status(200).json(medicalData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

//Add Medical History
//@route POST /api/user/:id/medical-history
//@access Public
const addMedicalHistory = asyncHandler (async (req, res) => {
    const { allergies, diagnosis, bloodPressure, temperature, surgeries } = req.body;

    try {
        // Find the patient record by ID
        const record = await Records.findById(req.params.id);

        if (!record) {
            res.status(404); // Change the status to 404 for "Not Found"
            throw new Error('Record not found');
        }

        // Create a new medical history item
        const newMedicalHistoryItem = {
            allergies,
            diagnosis,
            bloodPressure,
            temperature,
            surgeries
        };

        // Add the new medical history item to the record
        record.medicalHistory.push(newMedicalHistoryItem);

        // Save the updated record
        await record.save();

        res.status(201).json(newMedicalHistoryItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})


//Edit a Medical History
//@route PUT /api/records/:id/medical-history/:id
//@access Public
const editMedicalHistory = asyncHandler (async (req, res) => {
    const { allergies, diagnosis, bloodPressure, temperature, surgeries } = req.body;

    try {
        // Find the patient record by ID
        const record = await Records.findOne({
            'medicalHistory._id': req.params.id
        });

        if (!record) {
            res.status(404); // Change the status to 404 for "Not Found"
            throw new Error('Record not found');
        }

        // Find the specific medical history item within the array
        const medicalHistoryItem = record.medicalHistory.find(
            (item) => item._id.toString() === req.params.id
        );

        if (!medicalHistoryItem) {
            res.status(404); // Change the status to 404 for "Not Found"
            throw new Error('Medical history item not found');
        }

        // Update the medical history item with the new values
        medicalHistoryItem.allergies = allergies;
        medicalHistoryItem.diagnosis = diagnosis;
        medicalHistoryItem.bloodPressure = bloodPressure;
        medicalHistoryItem.temperature = temperature;
        medicalHistoryItem.surgeries = surgeries;

        // Save the updated record
        await record.save();

        res.status(200).json(medicalHistoryItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})


//Get One Medical History
//@route GET /api/records/getmedical/:id
//@access All
const getOneMedicalHistory = asyncHandler (async (req, res) => {
const { medicalId } = req.params;
    const medicalHistoryItem = await Records.findOne({
        'medicalHistory.medicalId': medicalId
    });

    if (!medicalHistoryItem) {
        res.status(404); // Change the status to 404 for "Not Found"
        throw new Error('Medical history item not found');
    }

    // Extract the specific medical history record from the array
    const specificRecord = medicalHistoryItem.medicalHistory.find(
        (item) => item.medicalId && item.medicalId.toString() === medicalId
    );

    if (!specificRecord) {
        res.status(404); // Change the status to 404 for "Not Found"
        throw new Error('Specific medical history item not found');
    }

    res.status(200).json(specificRecord);
});



// Delete Medical History
// @route DELETE /api/records/medical-history/:id
// @access Public
const deleteMedicalHistory = asyncHandler(async (req, res) => {
    try {
        // Find the patient record by ID
        const record = await Records.findOne({
            'medicalHistory._id': req.params.id
        })
    
        if (!record) {
            res.status(404); // Change the status to 404 for "Not Found"
            throw new Error('Record not found');
        }
    

        // Find the index of the medical history item to delete
        const historyIndex = record.medicalHistory.find(
            (item) => item._id.toString() === req.params.historyId
        );

        if (historyIndex === -1) {
            res.status(404); // Change the status to 404 for "Not Found"
            throw new Error('Medical history item not found');
        }

        // Remove the medical history item from the array
        record.medicalHistory.splice(historyIndex, 1);

        // Save the updated record
        await record.save();

        res.status(204).send('Data deleted successfuly'); // Return a 204 No Content status for success
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = {
    addMedicalHistory,
    editMedicalHistory,
    getOneMedicalHistory,
    deleteMedicalHistory,
    getAllMedical
}