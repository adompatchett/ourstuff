const express = require('express');
const router = express.Router();
const Video = require('../../models/Video');
const Photography = require('../../models/Photo');
const Artwork = require('../../models/Artwork');
const Product = require('../../models/Product');
const Blog = require('../../models/Blog');
const Writing = require('../../models/Writing');
const Podcast = require('../../models/Podcast');
const Music = require('../../models/Audio');
const User = require('../../models/User');
const path = require('path');

// Get a random video
router.get('/video/random', async (req, res) => {
  try {
    const count = await Video.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const video = await Video.findOne().skip(randomIndex);

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random video' });
  }
});

router.get('/video/single/:id', async (req,res) =>{

    try{

        const video = await Video.findById(req.params.id);
        
        res.sendFile(path.join(__dirname,"../../uploads/video/" + video.filename));


    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});

    }

})

// Get a random photography
router.get('/photo/random', async (req, res) => {
  try {
    const count = await Photography.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const photography = await Photography.findOne().skip(randomIndex);
    res.json(photography);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random photography' });
  }
});

router.get('/photo/single/:id', async (req,res) =>{

    try{

        const photo = await Photography.findById(req.params.id);
        
        res.sendFile(path.join(__dirname,"../../uploads/photo/" + photo.filename));



    }catch(error){

        res.status(500).json({message: 'Server error'});

    }

})

// Get a random artwork
router.get('/artwork/random', async (req, res) => {
  try {
    const count = await Artwork.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const artwork = await Artwork.findOne().skip(randomIndex);
    res.json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random artwork' });
  }
});

router.get('/artwork/single/:id', async (req, res) => {
    try {
      const artwork = await Artwork.findById(req.params.id);
      if (!artwork) {
        return res.status(404).json({ message: 'Artwork not found' });
      }
  
      res.sendFile(path.join(__dirname, '../../uploads/artwork/' + artwork.filename));
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

// Get a random product
router.get('/store/random', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const product = await Product.findOne().skip(randomIndex);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random product' });
  }
});

router.get('/store/single/:id', async (req,res) =>{

    try{

        const product = await Product.findById(req.params.id);
        res.sendFile(path.join(__dirname,"../../uploads/store/" + product.image));


    }catch(error){

        res.status(500).json({message: 'Server error'});

    }

})

// Get a random blog
router.get('/blog/random', async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const blog = await Blog.findOne().skip(randomIndex);
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random blog' });
  }
});

// Get a random writing
router.get('/writing/random', async (req, res) => {
  try {
    const count = await Writing.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const writing = await Writing.findOne().skip(randomIndex);
    res.json(writing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random writing' });
  }
});

router.get('/writing/single/:id',async (req,res)=>{

    const writing = await Writing.findById(req.params.id);
    res.json(writing);
            

})

// Get a random podcast
router.get('/podcast/random', async (req, res) => {
  try {
    const count = await Podcast.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const podcast = await Podcast.findOne().skip(randomIndex);
    res.json(podcast);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random podcast' });
    }
    });

    router.get('/podcast/single/:id', async (req,res) =>{

        try{
    
            const podcast = await Podcast.findById(req.params.id);
            res.sendFile(path.join(__dirname,"../../uploads/podcast/" + podcast.filename));
    
    
        }catch(error){
    
            res.status(500).json({message: 'Server error'});
    
        }
    
    })
    
    // Get a random music track
    router.get('/audio/random', async (req, res) => {
    try {
    const count = await Music.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const music = await Music.findOne().skip(randomIndex);
    res.json(music);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random music track' });
    }
    });

    router.get('/audio/single/:id', async (req,res) =>{

        try{
    
            const audio = await Music.findById(req.params.id);
            res.sendFile(path.join(__dirname,"../../uploads/audio/" + audio.fileName));
    
    
        }catch(error){
            console.log(error);
            res.status(500).json({message: 'Server error'});
    
        }
    
    })
    
    // Get a random user
    router.get('/user/random', async (req, res) => {
    try {
    const count = await User.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const user = await User.findOne().skip(randomIndex);
    res.json(user);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve random user' });
    }
    });
    
    module.exports = router;
