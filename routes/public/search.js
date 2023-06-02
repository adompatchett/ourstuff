const express = require('express');
const router = express.Router();

// Import necessary modules and models
const Audio = require('../../models/Audio');
const Video = require('../../models/Video'); 
const Photo = require('../../models/Photo');
const Writing = require('../../models/Writing');
const Product = require('../../models/Product'); 
const User = require('../../models/User');
const Podcast = require('../../models/Podcast');
const Blog = require('../../models/Blog');

// Define the search route
router.get('/', async (req, res) => {
  const searchQuery = req.query.q;
  

  try {
    // Perform search across multiple collections based on the search query
    const musicResults = await Audio.find({ tags: { $regex: searchQuery, $options: 'i' } });
    const videoResults = await Video.find({ tags: { $regex: searchQuery, $options: 'i' } });
    const photoResults = await Photo.find({ tags: { $regex: searchQuery, $options: 'i' } });
    const writingResults = await Writing.find({ tags: { $regex: searchQuery, $options: 'i' } });
    const blogResults = await Blog.find({ tags: { $regex: searchQuery, $options: 'i' } });
    const storeResults = await Product.find({ tags: { $regex: searchQuery, $options: 'i' } });
    const userResults = await User.find({ username: { $regex: searchQuery, $options: 'i' } });
    const podcastResults = await Podcast.find({ tags: { $regex: searchQuery, $options: 'i' } });

    // Combine and send the search results as a response
    const results = {
      music: musicResults,
      video: videoResults,
      photo: photoResults,
      writing: writingResults,
      blog: blogResults,
      store: storeResults,
      user: userResults,
      podcast: podcastResults
    };

    res.json(results);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'An error occurred during the search' });
  }
});

module.exports = router;