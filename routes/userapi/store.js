const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const passport = require('passport');
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/store'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`); // Set the filename to be unique
  },
});

const upload = multer({ storage });

// Get all products
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const products = await Product.find({createdby:req.user.id});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.sendFile(path.join(__dirname,'../../uploads/store/' + product.image));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// Create a new product
router.post('/', passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageUrl = req.file.filename; // Get the uploaded image file path
    const product = new Product({ name, description, price, image: imageUrl, createdby: req.user.id });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// Update a product
router.put('/:id', passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const imageUrl = req.file ? req.file.path : undefined; // Get the updated image file path, if provided
    const updateData = { name, description, price };
    if (imageUrl) {
      updateData.image = imageUrl;
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;