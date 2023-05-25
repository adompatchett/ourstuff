// app.js (or wherever your Express app is defined)

const express = require('express');
const router = express.Router();

// Import necessary modules and models
const Comment = require('../../models/Comment');
const passport = require('passport');

// Define the comments route
router.get('/:type/:itemId',async (req, res) => {
  const { type, itemId } = req.params;
    
  console.log(req.params);
  
  try {
    let comments;
    // Route to different paths based on the type
    if (type === 'video') {
      comments = await Comment.find({ bind: itemId });
    } else if (type === 'blog') {
      comments = await Comment.find({ bind: itemId });
    } else if (type === 'podcast') {
      comments = await Comment.find({ bind: itemId });
    } else if (type === 'writing') {
      comments = await Comment.find({ bind: itemId });
    } else if (type === 'artwork') {
      comments = await Comment.find({ bind: itemId });
    } else if (type === 'music') {
      comments = await Comment.find({ bind: itemId });
    } else if (type === 'photo') {
      comments = await Comment.find({ bind: itemId });
    } else if (type === 'store') {
      comments = await Comment.find({ bind: itemId });
    } else {
      // Invalid type provided
      return res.status(400).json({ error: 'Invalid type' });
    }

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'An error occurred while fetching comments' });
  }
});

router.post('/',passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { type, itemId, content } = req.body;
  const userid = req.user.id;
  try {
    let comment;
    // Route to different paths based on the type
    if (type === 'video') {
      comment = await Comment.create({ bind: itemId,type:'video',author:userid, content });
    } else if (type === 'blog') {
      comment = await Comment.create({ bind: itemId,type:'blog',author:userid, content });
    } else if (type === 'podcast') {
      comment = await Comment.create({ bind: itemId,type:'podcast',author:userid, content });
    } else if (type === 'writing') {
      comment = await Comment.create({ bind: itemId,type:'writijng',author:userid, content });
    } else if (type === 'artwork') {
      comment = await Comment.create({ bind: itemId,type:'artwork',author:userid, content });
    } else if (type === 'music') {
      comment = await Comment.create({ bind: itemId,type:'music',author:userid, content });
    } else if (type === 'photo') {
      comment = await Comment.create({ bind: itemId,type:'photo',author:userid, content });
    } else if (type === 'store') {
      comment = await Comment.create({ bind: itemId,type:'store',author:userid, content });
    } else {
      // Invalid type provided
      return res.status(400).json({ error: 'Invalid type' });
    }
    console.log(comment);
    res.json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'An error occurred while adding the comment' });
  }
});

module.exports = router;
