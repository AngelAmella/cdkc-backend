const asyncHandler = require('express-async-handler')
const Appointments = require('../models/AppointmentModel')
const io = require('socket.io')();

//Get All Appointments
//@route GET /api/appointments
//@access Public
const getAppointment = asyncHandler (async (req, res) => {
    const appointment = await Appointments.find({Appointments})
    res.status(200).json(appointment)
})

//Get One Appointment
//@route GET /api/appointment/:id
//@access Public
const getOneAppointment = asyncHandler (async (req, res) => {
    const appointment = await Appointments.findById(req.params.id)

    if(!appointment){
        res.status(400)
        throw new Error('Appointment not found')
    }
    
    res.status(200).json(appointment)
})

//Get Multiple Appointments
//@route GET /api/appointments/:ids
//@access Public
const getMultiAppointments = asyncHandler (async (req, res) => {
    try{
    const appointmentIds = req.params.ids.split(',');
    const appointments = await Appointments.find({ _id: { $in: appointmentIds } });
    res.status(200).json(appointments)

    }catch(error){
        res.status(500).json({error:error.message})
    }
})

// Get Appointments created by the authenticated user
//@route GET /api/appointments/user/:userId
//@access Protected (requires authentication)
const getAppointmentsByUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId; 
  
    // Fetch appointments created by the authenticated user
    const appointments = await Appointments.find({ userId: userId });
  
    res.status(200).json(appointments);
  });
  

//Post an Appointment
//@route POST /api/appointment
//@access Public
const postAppointment = asyncHandler (async (req, res) => {
    const { 
        service,
        UserName,
        appointmentDate,
        appointmentTime
     } = req.body

    if(!UserName || !appointmentTime || !appointmentDate){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //Check if Appointment exist
    const appointmentExist = await Appointments.findOne({
        appointmentTime, appointmentDate, service
    });

    if (appointmentExist) {
        res.status(400);
        throw new Error('Timeslot already booked for the selected service on this date');
    }

    // Create new appointment
    
    const defaultService = req.body.service || 'Nephrology Consultation';
    const appointment = await Appointments.create({
        service: defaultService,
        UserName,
        appointmentDate,
        appointmentTime
    })

    if(appointment){
        res.status(201).json({
            _id: appointment.id,
            service:appointment.service,
            UserName: appointment.UserName,
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime
        })
    } else {
        res.status(400)
        throw new Error('Cannot add Appointment')
    }
})

//Check if an Appointment Timeslot is available
//@route POST /api/appointment/check
//@access Public
const checkAppointment = asyncHandler (async (req, res) => {
    let { appointmentTime, appointmentDate } = req.body

    if(!appointmentTime || !appointmentDate){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //Check if Timeslot is available
    const isAvailable = await Appointments.findOne({
        appointmentTime, 
        appointmentDate,
        service})

    if(isAvailable){
        res.status(400)
        throw new Error('Timeslot already booked for the selected service! Please try again')
    }
})


const updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
        const appointment = await Appointments.findById(id);

        if (!appointment) {
            res.status(404).json({ error: 'Appointment not found' });
        } else {
            // Update the status of the appointment
            appointment.status = status;
            await appointment.save();

            // Emit a Socket.io event to notify the user about the status change
            io.emit('appointmentStatusChanged', {
                appointmentId: id,
                status: status,
            });

            res.status(200).json(appointment);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

const cancelAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointments.findById(id);

        if (!appointment) {
            res.status(404).json({ error: 'Appointment not found' });
        } else {
            // Update the status of the appointment to Cancelled
            appointment.status = 'Cancelled';
            await appointment.save();

            res.status(200).json(appointment);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});


//Delete an Appointment
//@route DELETE /api/appointment/:id
//@access Public
const deltAppointment = asyncHandler (async (req, res) => {
    const appointment = await Appointments.findById(req.params.id)

    if(!appointment){
        res.status(400)
        throw new Error('Appointment not found')
    }

    await appointment.deleteOne()

    res.status(200).json({ id: req.params.id})
})


//Delete Multiple Appointments
//@route DELETE /api/appointment/:ids
//@access Public
const deltMultiAppointment = asyncHandler (async (req, res) => {
    const appointment = await Appointments.findById(req.params.id)

    if(!appointment){
        res.status(400)
        throw new Error('Appointment not found')
    }

    await appointment.deleteMany()

    res.status(200).json({ id: req.params.id})
})

// MDB Query for Reports
// @route POST /api/appointments/search
// @access Public
const searchAppointments = asyncHandler(async (req, res) => {
    const { text } = req.body;
    
    try {
      const result = await Appointments.aggregate([
        {
          $search: {
            index: 'check',
            text: {
              query: text.query, 
              path: {
                wildcard: '*',
              },
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
    getAppointment,
    getOneAppointment,
    getMultiAppointments,
    getAppointmentsByUser,
    postAppointment,
    updateAppointment,
    cancelAppointment,
    deltAppointment,
    deltMultiAppointment,
    checkAppointment,
    searchAppointments
}