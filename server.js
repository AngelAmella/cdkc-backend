const express = require('express')
const colors = require('colors')
const { errorHandler } = require('./middleware/middleware')
const connectDB = require('./database/db')
const cors = require('cors')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const socketIo = require('socket.io');
const http = require('http'); 
const path = require('path');


connectDB()

const app = express()

app.use(cors())

app.options('/api/appointment/:id/status', cors());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/user', require('./routes/UserRouter'))
app.use('/api/admin', require('./routes/AdminRouter'))
app.use('/api/appointments', require('./routes/AppointmentsRouter'))
app.use('/api/records', require('./routes/PatientRecordsRouter'))
app.use('/api/inventory', require('./routes/InventoryRouter'))
app.use('/api/purchase', require('./routes/PharmRouter')) 
app.use('/api/announcement', require('./routes/AnnouncementRouter')) 

app.use(errorHandler)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/announcements', express.static(path.join(__dirname, 'announcements')));

// app.listen(port, () => console.log(`Server started on port ${port}`))
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST", "PUT", "DELETE"] 
    }
  });

server.listen(port, () => console.log(`Server started on port ${port}`.green));