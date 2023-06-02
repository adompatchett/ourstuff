const express = require('express');
const router = express.Router();
const Blog = require('../../models/Blog');
const User = require('../../models/User');
const passport = require('passport');
const notificationService = require('../../notifications/notificationService');
// Get all blog posts
router.get('/',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const blogs = await Blog.find({createdby:req.user.id});
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a specific blog post by ID
router.get('/:id',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { title, content,description,tags } = req.body;
      console.log(req.body);
      const author = req.user._id;
      const newBlog = new Blog({ title, content, description, tags, author,createdby:req.user.id,locked:true});
      const savedBlog = await newBlog.save();
      const username = await User.findById(req.user.id);
    notificationService.sendNotificationToFollowers(req.user.id,username.username + " wrote a blog post!")
      res.json(savedBlog);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

// Update a blog post
router.put('/:id',passport.authenticate('jwt', { session: false }),async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a blog post
router.delete('/:id',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;