const express = require('express');
const router = express.Router();
const multer = require('multer');
const Video = require('../../models/Video');
const fs = require('fs');
const passport = require('passport');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/video'); // Set the destination folder for uploaded videos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename for the uploaded video
  },
});

// Create a Multer instance with the storage configuration
const upload = multer({ storage: storage });

// POST route for video upload
router.post('/', passport.authenticate('jwt', { session: false }),upload.single('file'), async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    // Save the video details in the database
    const video = new Video({
      filename: req.file.filename,
      originalName: req.file.originalname,
      createdby: req.user.id, // Assuming the authenticated user ID is available in req.user.id
    });
    await video.save();

    res.json({ message: 'Video uploaded successfully', video });
  } catch (error) {
    console.error('Failed to upload video', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
});

// GET route for retrieving all videos
router.get('/',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const videos = await Video.find({createdby:req.user.id});
    res.json(videos);
  } catch (error) {
    console.error('Failed to retrieve videos', error);
    res.status(500).json({ message: 'Failed to retrieve videos' });
  }
});

// GET route for retrieving a video by ID and streaming it to the client
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const filePath = path.join(__dirname,`../../uploads/video/${video.filename}`);
    const stat = fs.statSync(filePath);

    

    res.sendFile(filePath);
  } catch (error) {
    console.error('Failed to retrieve video', error);
    res.status(500).json({ message: 'Failed to retrieve video' });
  }
});

module.exports = router;
