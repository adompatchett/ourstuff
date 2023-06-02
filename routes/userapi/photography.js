const express = require('express');
const fs = require('fs');
const path = require('path');
const Photo = require('../../models/Photo');
const passport = require('passport');
const router = express.Router();
const multer = require('multer');
const User = require('../../models/User');
const notificationService = require('../../notifications/notificationService');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photo'); // Set the destination folder where the uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // Set the filename for the uploaded file
  }
});

const upload = multer({ storage: storage });


router.post('/', passport.authenticate('jwt', { session: false }), upload.single('photo'), async (req, res) => {
  try {
    const { filename, path, originalname } = req.file;
     // Read the file from the disk
    const photo = new Photo({
      filename,
      path,
      originalname,
      createdby: req.user.id,
      title:req.body.title,
      description:req.body.description,
      tags:req.body.tags, // Store the photo data in the 'data' field
      locked:true
    });
    const savedPhoto = await photo.save();
    const username = await User.findById(req.user.id);
    notificationService.sendNotificationToFollowers(req.user.id,username.username + " added a photo!")
    res.status(201).json(savedPhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload photo' });
  }
});

// Route for getting all photos
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const photos = await Photo.find({ createdby: req.user.id });
    res.json({ photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch photos' });
  }
});

// Route for fetching a single photo by its ID and serving its data
router.get('/:id', async (req, res) => {
  try {
    const photoId = req.params.id;
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.sendFile(path.join(__dirname,"../../uploads/photo/" + photo.filename));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch photo data' });
  }
});

router.delete('/:id',passport.authenticate('jwt', { session: false }),async (req,res)=>{

  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Check if the logged-in user is the creator of the artwork
    if (photo.createdby.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
   
    const response = await Photo.deleteOne({_id:photo._id});
    console.log(response);
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete photo' });
  }

})

module.exports = router;