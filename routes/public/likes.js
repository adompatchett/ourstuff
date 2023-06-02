const express = require('express');
const router = express.Router();
const Artwork = require('../../models/Artwork');
const Music = require('../../models/Audio');
const Photo = require('../../models/Photo');
const Podcast = require('../../models/Podcast');
const Writing = require('../../models/Writing');
const StoreItem = require('../../models/Product');
const Video = require('../../models/Video');
const passport = require('passport');

router.get('/artwork/:id/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    const userLiked = artwork.likes.includes(req.user.id);
    if (userLiked) {
      return res.status(400).json({ message: 'User already liked this artwork' });
    }

    const userDisliked = artwork.dislikes.includes(req.user.id);
    if (userDisliked) {
      // Remove the user's ID from the dislikes array
      artwork.dislikes = artwork.dislikes.filter(id => id !== req.user.id);
    }

    artwork.likes.push(req.user.id);
    await artwork.save();

    res.json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/artwork/:id/dislike', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    const userLiked = artwork.likes.includes(req.user.id);
    const userDisliked = artwork.dislikes.includes(req.user.id);

    if (userLiked) {
      return res.status(400).json({ message: 'User already liked this artwork' });
    }

    if (userDisliked) {
      return res.status(400).json({ message: 'User already disliked this artwork' });
    }

    artwork.dislikes.push(req.user.id);
    await artwork.save();

    res.json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/music/:id/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music track not found' });
    }

    const userLiked = music.likes.includes(req.user.id);
    if (userLiked) {
      return res.status(400).json({ message: 'User already liked this music track' });
    }

    const userDisliked = music.dislikes.includes(req.user.id);
    if (userDisliked) {
      // Remove the user's ID from the dislikes array
      music.dislikes = music.dislikes.filter(id => id !== req.user.id);
    }

    music.likes.push(req.user.id);
    await music.save();

    res.json(music);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/music/:id/dislike', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ message: 'Music track not found' });
    }

    const userLiked = music.likes.includes(req.user.id);
    if (userLiked) {
      // Remove the user's ID from the likes array
      music.likes = music.likes.filter(id => id !== req.user.id);
    }

    music.dislikes.push(req.user.id);
    await music.save();

    res.json(music);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/photo/:id/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const userLiked = photo.likes.includes(req.user.id);
    if (userLiked) {
      return res.status(400).json({ message: 'User already liked this photo' });
    }

    const userDisliked = photo.dislikes.includes(req.user.id);
    if (userDisliked) {
      // Remove the user's ID from the dislikes array
      photo.dislikes = photo.dislikes.filter(id => id !== req.user.id);
    }

    photo.likes.push(req.user.id);
    await photo.save();

    res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/photo/:id/dislike', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const userLiked = photo.likes.includes(req.user.id);
    if (userLiked) {
      // Remove the user's ID from the likes array
      photo.likes = photo.likes.filter(id => id !== req.user.id);
    }

    photo.dislikes.push(req.user.id);
    await photo.save();

    res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/podcast/:id/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    const userLiked = podcast.likes.includes(req.user.id);
    const userDisliked = podcast.dislikes.includes(req.user.id);

    if (userLiked) {
      return res.status(400).json({ message: 'User already liked this podcast' });
    }

    if (userDisliked) {
      // Remove user from dislikes array
      podcast.dislikes = podcast.dislikes.filter(userId => userId !== req.user.id);
    }

    podcast.likes.push(req.user.id);
    await podcast.save();

    res.json(podcast);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/podcast/:id/dislike', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({ message: 'Podcast not found' });
    }

    const userDisliked = podcast.dislikes.includes(req.user.id);
    const userLiked = podcast.likes.includes(req.user.id);

    if (userDisliked) {
      return res.status(400).json({ message: 'User already disliked this podcast' });
    }

    if (userLiked) {
      // Remove user from likes array
      podcast.likes = podcast.likes.filter(userId => userId !== req.user.id);
    }

    podcast.dislikes.push(req.user.id);
    await podcast.save();

    res.json(podcast);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  
router.get('/store/:id/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const storeItem = await StoreItem.findById(req.params.id);
    if (!storeItem) {
      return res.status(404).json({ message: 'Store item not found' });
    }

    const userLiked = storeItem.likes.includes(req.user.id);
    const userDisliked = storeItem.dislikes.includes(req.user.id);

    if (userLiked) {
      return res.status(400).json({ message: 'User already liked this store item' });
    }

    if (userDisliked) {
      // Remove user from dislikes array
      storeItem.dislikes = storeItem.dislikes.filter(userId => userId !== req.user.id);
    }

    storeItem.likes.push(req.user.id);
    await storeItem.save();

    res.json(storeItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/store/:id/dislike', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const storeItem = await StoreItem.findById(req.params.id);
    if (!storeItem) {
      return res.status(404).json({ message: 'Store item not found' });
    }

    const userDisliked = storeItem.dislikes.includes(req.user.id);
    const userLiked = storeItem.likes.includes(req.user.id);

    if (userDisliked) {
      return res.status(400).json({ message: 'User already disliked this store item' });
    }

    if (userLiked) {
      // Remove user from likes array
      storeItem.likes = storeItem.likes.filter(userId => userId !== req.user.id);
    }

    storeItem.dislikes.push(req.user.id);
    await storeItem.save();

    res.json(storeItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
  
router.get('/writing/:id/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const writing = await Writing.findById(req.params.id);
    if (!writing) {
      return res.status(404).json({ message: 'Writing not found' });
    }

    const userLiked = writing.likes.includes(req.user.id);
    const userDisliked = writing.dislikes.includes(req.user.id);

    if (userLiked) {
      return res.status(400).json({ message: 'User already liked this writing' });
    }

    if (userDisliked) {
      // Remove user from dislikes array
      writing.dislikes = writing.dislikes.filter(userId => userId !== req.user.id);
    }

    writing.likes.push(req.user.id);
    await writing.save();

    res.json(writing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/writing/:id/dislike', passport.authenticate('jwt', { session: false }), async (req, res) => {
  
  try {
    const writing = await Writing.findById(req.params.id);
    
    if (!writing) {
      return res.status(404).json({ message: 'Writing not found' });
    }

    const userDisliked = writing.dislikes.includes(req.user.id);
    const userLiked = writing.likes.includes(req.user.id);

    if (userDisliked) {
      return res.status(400).json({ message: 'User already disliked this writing' });
    }

    if (userLiked) {
      // Remove user from likes array
      writing.likes = writing.likes.filter(userId => userId !== req.user.id);
    }

    writing.dislikes.push(req.user.id);
    await writing.save();

    res.json(writing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/video/:id/like', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userLiked = video.likes.includes(req.user.id);
    const userDisliked = video.dislikes.includes(req.user.id);

    if (userLiked) {
      return res.status(400).json({ message: 'User already liked this video' });
    }

    if (userDisliked) {
      // Remove user from dislikes array
      video.dislikes = video.dislikes.filter(userId => userId !== req.user.id);
    }

    video.likes.push(req.user.id);
    await video.save();

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/video/:id/dislike', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userDisliked = video.dislikes.includes(req.user.id);
    const userLiked = video.likes.includes(req.user.id);

    if (userDisliked) {
      return res.status(400).json({ message: 'User already disliked this video' });
    }

    if (userLiked) {
      // Remove user from likes array
      video.likes = video.likes.filter(userId => userId !== req.user.id);
    }

    video.dislikes.push(req.user.id);
    await video.save();

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

  
  module.exports = router;