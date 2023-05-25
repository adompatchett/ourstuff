const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const path = require('path');

router.get('/all', async (req, res) => {
  try {
    const users = await User.aggregate([{ $sample: { size: 10 } }]); // Retrieve a random sample of 10 users from the database
    res.json(users); // Send the users as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/all_id', async (req, res) => {
    try {
      const users = await User.find({}, '_id');
      const userIds = users.map(user => user._id);
      res.json(userIds);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/profile/:username', async (req,res)=>{
    
    const user = await User.findOne({username:req.params.username});
    const secureuser = {};
    secureuser.firstname = user.firstname;
    secureuser.lastname = user.lastname;
    secureuser.username = user.username;
    secureuser.location = user.location;
    secureuser.biography = user.biography;
    secureuser.joinedDate = user.joinedDate;
    secureuser.website = user.website;
    secureuser.sociallinks = user.sociallinks;
    console.log(secureuser);
    res.json(secureuser);

  })

router.get('/:userId/profile-pic', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).select('profilepic');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.sendFile(path.join(__dirname,'../../uploads/users/' + user.profilepic));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;