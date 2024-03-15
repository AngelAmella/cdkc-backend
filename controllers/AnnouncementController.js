const asyncHandler = require('express-async-handler');
const Announcement = require('../models/AnnouncementModel');
const multer = require('multer');
const path = require('path');

// Get All Announcement
//@route GET /api/announcement
//@access Public
const getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.find();
  res.status(200).json(announcement);
});

// Get One Announcement
//@route GET /api/announcement/:id
//@access Public
const getOneAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(400);
    throw new Error('Announcement not found');
  }

  res.status(200).json(announcement);
});

// Get Multiple Announcement
//@route GET /api/announcement/:ids
//@access Public
const getMultiAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.find();
  res.status(200).json(announcement);
});

// Post an Announcement with image
// @route POST /api/announcement
// @access Public
const postAnnouncement = asyncHandler(async (req, res) => {
  try {
    const { announcementDescription } = req.body;

    // Check if required fields are present
    if (!announcementDescription) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    // Check if Announcement with the same announcementDescription already exists
    const announcementExist = await Announcement.findOne({ announcementDescription });

    if (announcementExist) {
      res.status(400);
      throw new Error('Announcement under that name in use');
    }

    // Log the file path to debug
    console.log('File Path:', req.file.path);

    // Create a new Announcement instance
    const announcement = new Announcement({
      announcementDescription,
      announcementImg: req.file ? req.file.path : '',
    });

    // Save the Announcement to the database
    await announcement.save();

    // Send a response
    res.status(201).json({
      _id: announcement.id,
      announcementDescription: announcement.announcementDescription,
      announcementImg: announcement.announcementImg,
    });
  } catch (error) {
    console.error('Error in postAnnouncement:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update an Announcement
// //@route PUT /api/announcement/:id
// //@access Public
const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(400);
    throw new Error('Announcement not found');
  }

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  res.status(200).json(updatedAnnouncement);
});

// Delete an Announcement and associated data
//@route DELETE /api/announcement/:id
//@access Public
const deltAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(400);
    throw new Error('Announcement not found');
  }

  // Delete associated image (if it exists)
  if (announcement.announcementImg) {
    // You might want to delete the image file from the server's file system here
    // fs.unlinkSync(announcement.announcementImg);
  }

  // Delete the announcement
  await announcement.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// Delete Multiple Announcement
//@route DELETE /api/announcement/:ids
//@access Public
const deltMultiAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(400);
    throw new Error('Announcement not found');
  }

  await announcement.deleteMany();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getAnnouncement,
  getOneAnnouncement,
  getMultiAnnouncement,
  postAnnouncement,
  updateAnnouncement,
  deltAnnouncement,
  deltMultiAnnouncement,
};
