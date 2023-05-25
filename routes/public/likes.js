const express = require('express');
const router = express.Router();
const Artwork = require('../../models/Artwork');
const Music = require('../../models/Audio');
const Photo = require('../../models/Photo');
const Podcast = require('../../models/Podcast');
const Writing = require('../../models/Writing');
const StoreItem = require('../../models/Product');
const passport = require('passport');

// Like an artwork
router.get('/artwork/:id/like',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    artwork.likes.push(req.user.id)    
    await artwork.save();

    res.json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike an artwork
router.get('/artwork/:id/dislike',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    artwork.dislikes.push(req.user.id);
    await artwork.save();

    res.json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a music track
router.get('/music/:id/like',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music track not found' });
    }

    music.likes.push(req.user.id);
    await music.save();

    res.json(music);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a music track
router.get('/music/:id/dislike',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music track not found' });
    }

    music.dislikes.push(req.user.id);
    await music.save();

    res.json(music);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a photo
router.get('/photo/:id/like',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    photo.likes.push(req.user.id);
    await photo.save();

    res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dislike a photo
router.get('/photo/:id/dislike',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    photo.dislikes.push(req.user.id);;
    await photo.save();

    res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/podcast/:id/like',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const podcast = await Podcast.findById(req.params.id);
      if (!podcast) {
        return res.status(404).json({ message: 'Podcast not found' });
      }
  
      podcast.likes.push(req.user.id);;
      await podcast.save();
  
      res.json(podcast);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Dislike a podcast
  router.get('/podcast/:id/dislike',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const podcast = await Podcast.findById(req.params.id);
      if (!podcast) {
        return res.status(404).json({ message: 'Podcast not found' });
      }
  
      podcast.dislikes.push(req.user.id);
      await podcast.save();
  
      res.json(podcast);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Like a store item
  router.get('/store/:id/like',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const storeItem = await StoreItem.findById(req.params.id);
      if (!storeItem) {
        return res.status(404).json({ message: 'Store item not found' });
      }
  
      storeItem.likes.push(req.user.id);
      await storeItem.save();
  
      res.json(storeItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Dislike a store item
  router.get('/store/:id/dislike',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const storeItem = await StoreItem.findById(req.params.id);
      if (!storeItem) {
        return res.status(404).json({ message: 'Store item not found' });
      }
  
      storeItem.dislikes.push(req.user.id);
      await storeItem.save();
  
      res.json(storeItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Like a writing
  router.get('/writing/:id/like',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const writing = await Writing.findById(req.params.id);
      if (!writing) {
        return res.status(404).json({ message: 'Writing not found' });
      }
  
      writing.likes.push(req.user.id);
      await writing.save();
  
      res.json(writing);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Dislike a writing
  router.get('/writing/:id/dislike',passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const writing = await Writing.findById(req.params.id);
      if (!writing) {
        return res.status(404).json({ message: 'Writing not found' });
      }
  
      writing.dislikes.push(req.user.id);
      await writing.save();
  
      res.json(writing);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;