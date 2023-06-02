const express = require('express');
const multer = require('multer');
const router = express.Router();
const Artwork = require('../../models/Artwork');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const upload = multer({ dest: 'uploads/artwork' });
const mongo = require('mongodb');
const notificationService = require('../../notifications/notificationService');
const User = require('../../models/User');

// Upload artwork
router.post('/', passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const file = req.file;

    const artwork = new Artwork({
      filename: req.file.filename,
      originalName: file.originalname,
      image: file.originalname,
      title: req.body.title,
      artist: req.body.artist,
      description: req.body.description,
      createdby: req.user._id,
      locked:true
    });

    await artwork.save();
    const username = await User.findById(req.user.id);
    notificationService.sendNotificationToFollowers(req.user.id,username.username + " uploaded artwork!")
    res.json({ message: 'Artwork uploaded successfully', artwork });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to upload artwork' });
  }
});

// Delete artwork by ID
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Check if the logged-in user is the creator of the artwork
    if (artwork.createdby.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
   
    const response = await Artwork.deleteOne({_id:artwork._id});
    console.log(response);
    res.json({ message: 'Artwork deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete artwork' });
  }
});

// Get all artwork
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const artwork = await Artwork.find({ createdby: req.user.id });
    res.json(artwork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve artwork' });
  }
});

// Get artwork by ID
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    res.sendFile(path.join(__dirname, '../../uploads/artwork/' + artwork.filename));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve artwork' });
  }
});

module.exports = router;
