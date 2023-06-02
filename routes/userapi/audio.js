const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Audio = require('../../models/Audio');
const passport = require('passport');
const path = require('path');
const notificationService = require('../../notifications/notificationService');
const router = express.Router();
const User = require('../../models/User');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/audio');
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4() + '.' + file.originalname.split('.').pop();
    cb(null, fileName);
  },
});

// Create a multer upload instance
const upload = multer({ storage: storage });

// POST route for uploading audio files
router.post('/', passport.authenticate('jwt', { session: false }), upload.single('audio'), async (req, res) => {
  const { originalname, filename } = req.file;
  console.log(req.body);
  try {
    const audio = new Audio({
      fileName: filename,
      originalName: originalname,
      createdby: req.user.id,
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags,
      locked:true
    });

    const savedAudio = await audio.save();
    const username = await User.findById(req.user.id);
    notificationService.sendNotificationToFollowers(req.user.id,username.username + " uploaded some music!")
    res.json(savedAudio);
  } catch (error) {
    console.error('Error saving audio:', error);
    res.status(500).json({ message: 'Error saving audio' });
  }
});

// GET route for retrieving all audio files
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const audioFiles = await Audio.find({ createdby: req.user.id });
    res.json(audioFiles);
  } catch (error) {
    console.error('Error retrieving audio files:', error);
    res.status(500).json({ message: 'Error retrieving audio files' });
  }
});

// GET route for retrieving an audio file by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const audio = await Audio.findById(id);
    if (!audio) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    const audiofile = path.join(__dirname, '../../uploads/audio/' + audio.fileName);
    console.log(audiofile);
    res.sendFile(audiofile);
  } catch (error) {
    console.error('Error retrieving audio:', error);
    res.status(500).json({ message: 'Error retrieving audio' });
  }
});

// DELETE route for deleting an audio file by ID
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { id } = req.params;

  try {
    const audio = await Audio.findById(id);
    if (!audio) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    if (audio.createdby.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    await Audio.findByIdAndRemove(id);
    res.json({ message: 'Audio deleted successfully' });
  } catch (error) {
    console.error('Error deleting audio:', error);
    res.status(500).json({ message: 'Error deleting audio' });
  }
});

module.exports = router;
