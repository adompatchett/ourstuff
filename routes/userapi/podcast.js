const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Podcast = require('../../models/Podcast');
const passport = require('passport');
const User = require('../../models/User');
const notificationService = require('../../notifications/notificationService');
// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/podcast'); // Specify the destination folder for uploaded podcasts
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`; // Generate a unique file name
    cb(null, fileName);
  },
});

// Create a multer upload instance
const upload = multer({ storage });

// Upload a podcast
router.post('/',passport.authenticate('jwt', { session: false }), upload.single('podcast'), async (req, res) => {
  try {
    // Save the podcast details in the database
    const podcast = new Podcast({
      filename: req.file.filename,
      originalName: req.file.originalname,
      title: req.body.title,
      description: req.body.description,
      createdby:req.user.id,
      tags:req.body.tags,
      locked:true
    });
    await podcast.save();

    res.json({ message: 'Podcast uploaded successfully', podcast });
    const username = await User.findById(req.user.id);
    notificationService.sendNotificationToFollowers(req.user.id,username.username + " created a podcast!")
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload podcast' });
  }
});

// Get all podcasts
router.get('/',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const podcasts = await Podcast.find({createdby:req.user.id});
    res.json(podcasts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve podcasts' });
  }
});

// Get a podcast by ID
router.get('/:id', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    const podcastfile = path.join(__dirname,'../../uploads/podcast',podcast.filename);
    res.sendFile(podcastfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve podcast' });
  }
});

// Delete a podcast by ID
router.delete('/:id',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    const filePath = path.join(__dirname, '../../uploads/podcast', podcast.filename);
    fs.unlinkSync(filePath); // Delete the podcast file from the file system

    await podcast.deleteOne(); // Delete the podcast document from the collection

    res.json({ message: 'Podcast deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete podcast' });
  }
});

module.exports = router;
