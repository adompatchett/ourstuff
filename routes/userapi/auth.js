const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const googleSecret = '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';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('1091531683861-9o8r99n9v345ushn164fkmgb4e4i39a9.apps.googleusercontent.com', googleSecret);
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
    console.log(token);
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

  router.get('/getloggedinuserid',passport.authenticate('jwt', { session: false }), async (req,res)=>{

    res.json({userid:req.user.id});

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

  async function verifyToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '1091531683861-9o8r99n9v345ushn164fkmgb4e4i39a9.apps.googleusercontent.com',
      });
      const payload = ticket.getPayload();
      // You can access the user information from the `payload` object
      const userId = payload.sub;
      const userEmail = payload.email;
      // Perform additional validation or processing as needed
      // ...
      return {userId,userEmail}; // Token is valid
    } catch (error) {
      console.error('Error verifying token:', error);
      return false; // Token is invalid
    }
  }

router.post('/google/login', async (req, res) => {
  // Handle Google login route
  try { 
   
    // Validate the JWT credentials, authenticate the user, and generate a new JWT token
    const tokenhealth = await verifyToken(req.body.jwtCredentials);
    
    if(!tokenhealth){

      return res.status(401).json({"message":"Not Authorized!"});

    }

    const result = await User.findOne({email:tokenhealth.userEmail,sub:tokenhealth.userId});
  if(result){
    console.log(result);
    const token = jwt.sign({ userId: result._id }, config.secretKey, {
      expiresIn: '24h',
    });

    res.json({ message: 'Login successful', token });

  }else{
    
    const username = uuidv4();
    const user = new User({email:tokenhealth.userEmail,sub:tokenhealth.userId,username});
    
    await user.save();

    const token = await jwt.sign({ userId: user._id }, config.secretKey, {
      expiresIn: '24h',
    });

    res.json({ message: 'Account created successfully', token });

  }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Logout route
router.post('/logout', (req, res) => {
  req.logout(()=>{
   
   

  }); // Passport.js logout
  
  res.json({ message: 'Logout successful' });

});

module.exports = router;