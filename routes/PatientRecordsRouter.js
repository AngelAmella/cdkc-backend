const express  = require('express')
const { 
    getRecords, 
    postRecords, 
    getOneRecord, 
    getMultipleRecords, 
    deltRecord,
    getRecordsByUserName,
    updateRecords,
    searchRecords
} = require('../controllers/PatientRecordsController')
const { 
    addMedicalHistory, 
    editMedicalHistory, 
    getOneMedicalHistory, 
    deleteMedicalHistory,
    getAllMedical
} = require('../controllers/MedicalHistoryController')


const router = express.Router()

router.route('/').get(getRecords).post(postRecords)

router.route('/:id').get(getOneRecord).delete(deltRecord).put(updateRecords)

router.route('/:ids').get(getMultipleRecords)

router.route('/:id/medical-history').post(addMedicalHistory)

router.route('/medical-history/:id').put(editMedicalHistory).delete(deleteMedicalHistory)

router.route('/getmedical/:id').get(getOneMedicalHistory)

router.route('/get-medical-history/:id').get(getAllMedical)

router.route('/getrecord/:userName').get(getRecordsByUserName)

router.route('/search').post(searchRecords)

module.exports = router