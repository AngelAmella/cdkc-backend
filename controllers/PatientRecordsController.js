const asyncHandler = require('express-async-handler')
const Records = require('../models/PatientRecordsModel')


//Get All Records
//@route GET /api/records
//@access Public
const getRecords = asyncHandler (async (req, res) => {
    const records = await Records.find({Records})
    res.status(200).json(records)
})


//Get One Records
//@route GET /api/records
//@access Public
const getOneRecord = asyncHandler (async (req, res) => {
    const record = await Records.findById(req.params.id)

    if(!record){
        res.status(400)
        throw new Error('No Records found')
    }
    
    res.status(200).json(record)
})


//Get Multiple Records
//@route GET /api/records
//@access Public
const getMultipleRecords = asyncHandler (async (req, res) => {
    const records = await Records.find({Records})
    res.status(200).json(records)
})

// Get Records for One User by Name
// @route GET /api/records/getrecord/:userName
// @access Protected (requires authentication)
const getRecordsByUserName = asyncHandler(async (req, res) => {
    const userName = req.params.userName;
    const records = await Records.find({ patientName: userName });
  
    if (!records || records.length === 0) {
      res.status(404);
      throw new Error('No Records found for the provided user name');
    }
  
    res.status(200).json(records);
  });
  

//Post a Record
//@route POST /api/records
//@access Public
const postRecords = asyncHandler (async (req, res) => {
    const { 
        patientName,
        weight,
        height,
        age,
        sex
     } = req.body

    if(!patientName && !age){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //Check if user exist
    const userExist = await Records.findOne({patientName})

    if(userExist){
        res.status(400)
        throw new Error('There is already a recorded Name!')
    }

    const records = await Records.create({
        patientName, 
        weight,
        height,
        age,
        sex
    })

    if(records){
        res.status(201).json({
            _id: records.id,
            patientName: records.patientName, 
            weight: records.weight,
            height: records.height,
            age: records.age,
            sex: records.age
        })
    } else {
        res.status(400)
        throw new Error('Cant register')
    }
})

//Update a Record
//@route PUT /api/records/:id
//@access Public
const updateRecords = asyncHandler (async (req, res) => {
    const record = await Records.findById(req.params.id)

    if(!record){
        res.status(400)
        throw new Error('No Records found')
    }

    const updatedRecord = await Records.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
    
    res.status(200).json(updatedRecord)
})


//Delete a Record
//@route DELETE /api/records/:id
//@access Public
const deltRecord = asyncHandler (async (req, res) => {
    const record = await Records.findById(req.params.id)

    if(!record){
        res.status(400)
        throw new Error('No Records found')
    }

    await record.deleteOne()

    res.status(200).json({ id: req.params.id})
})

// MDB Query for Reports
// @route POST /api/records/search
// @access Public
const searchRecords = asyncHandler(async (req, res) => {
    const { text } = req.body;
  
    try {
      const result = await Records.aggregate([
        {
          $search: {
            index: 'records',
            compound: {
              should: [
                {
                  text: {
                    query: text.query,
                    path: {
                      wildcard: '*',
                    },
                  },
                },
              ],
            },
          },
        },
      ]);
  
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
module.exports = {
    getRecords,
    getOneRecord,
    getMultipleRecords,
    postRecords,
    updateRecords,
    deltRecord,
    getRecordsByUserName,
    searchRecords
}