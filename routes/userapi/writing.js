const express = require('express');
const router = express.Router();
const Writing = require('../../models/Writing');
const passport = require('passport');
const notificationService = require('../../notifications/notificationService');
// Get all writings
router.get('/',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const writings = await Writing.find({createdby:req.user.id});
      res.json(writings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  // Get a specific writing by ID
  router.get('/:id',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const writing = await Writing.findById(req.params.id);
      if (!writing) {
        return res.status(404).json({ message: 'Writing not found' });
      }
      res.json(writing);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

// Route to submit a writing
router.post('/',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    
    const { title, author, content, type,description,tags } = req.body;

    // Create a new writing entry
    const writing = new Writing({
      type,
      title,
      author,
      content,
      createdby:req.user.id,
      description,
      tags
    });

    // Save the writing entry to the database
    await writing.save();
    const username = await User.findById(req.user.id);
    notificationService.sendNotificationToFollowers(req.user.id,username.username + " wrote something!")
    res.json({ message: `${type} submitted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



  // DELETE /api/writing/:id
router.delete('/:id',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the writing by ID and delete it
      const writing = await Writing.findByIdAndDelete(id);
  
      if (!writing) {
        return res.status(404).json({ message: 'Writing not found' });
      }
  
      res.json({ message: 'Writing deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  



module.exports = router;
