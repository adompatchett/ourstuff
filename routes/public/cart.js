const express = require('express');
const router = express.Router();
const { Cart, CartItem } = require('../../models/Cart');
const passport = require('passport');

// Get user's shopping cart
router.get('/',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.find({user:userId}).populate('items.product');
    console.log(cart);
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add item to the shopping cart
router.post('/',passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const {  productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if the user's cart already exists, if not, create a new cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    console.log(userId);

    // Check if the product already exists in the cart, if not, create a new cart item
    const cartItem = cart.items.find((item) => item.product.toString() === productId);
    if (cartItem) {
      // If the product already exists, update the quantity
      cartItem.quantity += quantity;
    } else {
      // If the product doesn't exist, create a new cart item
      cart.items.push({ product: productId, quantity });
    }

    // Save the updated/created cart
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove item from the shopping cart
router.delete('/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { userId } = req.query;

    // Find the user's cart and remove the specified cart item
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter((item) => item._id.toString() !== cartItemId);
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;