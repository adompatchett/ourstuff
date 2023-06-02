const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const { verifyToken } = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const multer = require('multer');
const passport = require('passport');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});

const upload = multer({ storage });

router.get('/settings/profile-pic',passport.authenticate('jwt', { session: false }), upload.single('profilePic'), async (req, res) => {
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the user has a profile picture, send the image file
    if (user.profilepic) {
      res.sendFile(path.join(__dirname,'../../uploads/users/' + user.profilepic));
    } else {
      res.status(404).json({ error: 'Profile picture not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route for handling profile picture upload
router.post('/settings/profile-pic',passport.authenticate('jwt', { session: false }), upload.single('profilePic'), async (req, res) => {
  if (req.file) {
    // File uploaded successfully
    const user = await User.findById(req.user.id);
    user.profilepic = req.file.filename;
    await user.save();
    res.json({ message: 'Profile picture updated' });


  } else {
    // No file uploaded
    res.status(400).json({ error: 'No file uploaded' });
  }
});

router.post('/settings/profile',passport.authenticate('jwt', { session: false }), async (req,res)=>{
 
  const user = await User.findById(req.user.id);

  user.username = req.body.username;
  user.location = req.body.location;
  user.website = req.body.website;
  user.biography = req.body.biography;


  // Save the user to the database
  user.save()
    .then(() => {
      res.json({ message: 'User profile saved successfully' });
    })
    .catch(error => {
      console.error('Error saving user profile:', error);
      res.status(500).json({ error: 'Failed to save user profile' });
    });

})



// Create a new user
router.post('/create', verifyToken, async (req, res) => {
  
    const { username, password, role } = req.body;

  try {
    // Check if user with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      username,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await user.save();

    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update user
router.put('/update/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user fields
    user.username = username;
    user.role = role;

    // Update the password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    await user.save();

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete user
router.delete('/delete/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID and delete
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
    
    try {
      // Extract the user ID from the JWT token
      const token = req.headers.authorization.substring(7);
      const decoded = jwt.verify(token, config.secretKey);
      const userId = decoded.userId;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user profile data
      res.json({ username: user.username });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
module.exports = router;