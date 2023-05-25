const express = require('express');
const router = express.Router();
const Writing = require('../../models/Writing');
const passport = require('passport');

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
    
    const { title, author, content, type } = req.body;

    // Create a new writing entry
    const writing = new Writing({
      type,
      title,
      author,
      content,
      createdby:req.user.id
    });

    // Save the writing entry to the database
    await writing.save();

    res.json({ message: `${type} submitted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/writing/:id
router.put('/:id',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { id } = req.params;
      const { type, title, author, content } = req.body;
  
      // Find the writing by ID and update its fields
      const writing = await Writing.findByIdAndUpdate(
        id,
        { type, title, author, content },
        { new: true }
      );
  
      if (!writing) {
        return res.status(404).json({ message: 'Writing not found' });
      }
  
      res.json(writing);
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
