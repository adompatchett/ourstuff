const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
// Login route
router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
    
    try {
      // Generate a JWT token
      const token = jwt.sign({ userId: req.user._id }, config.secretKey, {
        expiresIn: '24h',
      });

      // Set the token as a cookie
      res.cookie('token', token, { httpOnly: true });
  
      // Return success message and token
      res.json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  router.get('/check-login', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, config.secretKey);
      res.set({
        'Content-Type': 'application/json'
      });
      return res.status(200).json({ isloggedin:true,userid:decoded.userId});
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Invalid token' });
    }
  });

  router.get('/check-login-test',passport.authenticate('jwt', { session: false }), async (req,res) =>{

    if(req.user){

      res.json({userid:req.user.id});

    }

  })

  router.post('/create-account', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Check if email is already taken
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already taken' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
  
      res.json({ message: 'Account created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create account' });
    }
  });
  
// Logout route
router.post('/logout', (req, res) => {
  req.logout(()=>{
   
   

  }); // Passport.js logout
  
  res.json({ message: 'Logout successful' });

});

module.exports = router;