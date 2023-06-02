// followers.js

// Import necessary modules and models
const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Add a follower to the user's account
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // ID of the user to add a follower to
    const { followerId } = req.body; // ID of the follower to add
    
    // Find the user and follower in the database
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);
    
    // Check if the user or follower exists
    if (!user || !follower) {
      return res.status(404).json({ error: 'User or follower not found' });
    }
    
    // Check if the follower is already added
    if (user.followers.includes(followerId)) {
      return res.status(400).json({ error: 'Follower already added' });
    }
    
    // Add the follower to the user's followers array
    user.followers.push(followerId);
    follower.following.push(userId);
    await user.save();
    await follower.save();

    console.log(user);
    console.log(follower);
    
    res.status(200).json({ message: 'Follower added successfully' });
  } catch (error) {
    console.error('Error adding follower:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:userId/check/:followerId', async (req, res) => {
    const userId = req.params.userId;
    const followerId = req.params.followerId;
  
    // Assuming you have a User model or any other way to access user data
    const user = await User.findById(userId);
    if (user.err) {
        console.error('Error finding user:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const isFollowing = user.followers.includes(followerId);
        res.json({ isFollowing });
      }
})

router.delete('/:userId', async (req, res) => {
  const userId = req.params.userId;
  const followerId = req.body.followerId;

  try {
    // Find the follower's user document by followerId
    const follower = await User.findById(followerId);
    const user = await User.findById(userId);

    if (!follower) {
      return res.status(404).json({ error: 'Follower not found' });
    }

    // Remove the userId from the follower's list of followed users
    follower.following.pull(userId);
    user.followers.pull(followerId);
    await follower.save();
    await user.save();

    // Send a success response
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
