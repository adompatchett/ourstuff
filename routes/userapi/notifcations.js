const express = require('express');

const User = require('../../models/User');
const router = express.Router();
const passport = require('passport');
const notificationService = require('../../notifications/notificationService');
router.get('/getusernotifications',passport.authenticate('jwt', { session: false }),async (req,res)=>{

    const user = await User.findById(req.user.id);
    res.send({notifications:user.notifications});

})

router.post('/mark-as-seen', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      user.notifications = []; // Empty the notifications array
      await user.save(); // Save the changes
  
      res.status(200).send();
    } catch (error) {
      console.error('Error marking notifications as seen:', error);
      res.status(500).send('Server error');
    }
  });

module.exports = router;