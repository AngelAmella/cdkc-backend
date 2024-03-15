

const express = require('express');
const { getAnnouncement, postAnnouncement, updateAnnouncement, deltAnnouncement, getOneAnnouncement, deltMultiAnnouncement, getMultiAnnouncement } = require('../controllers/AnnouncementController');
const router = express.Router();
const multer = require('multer');
const path = require('path');


// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log('File Received:', file.originalname);
      cb(null, 'announcements/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  

const upload = multer({ storage: storage });

router.route('/').get(getAnnouncement).post(upload.single('announcementImg'), postAnnouncement);

router.route('/:id').put(updateAnnouncement).delete(deltAnnouncement).get(getOneAnnouncement);

router.route('/:ids').delete(deltMultiAnnouncement).get(getMultiAnnouncement);

module.exports = router;
