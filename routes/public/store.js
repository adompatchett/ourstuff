const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// Get random products
router.get('/', async (req, res) => {
    try {
      const products = await Product.aggregate([
        { $sample: { size: 50 } } // Adjust the size as per your requirement
      ]);
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  module.exports = router;