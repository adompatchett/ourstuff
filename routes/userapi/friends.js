const express = require('express');
const User = require('../../models/User');

const router = express.Router();

// Search friends by username or email
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    // Find users matching the query
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } }, // Case-insensitive search by username
        { email: { $regex: query, $options: 'i' } }, // Case-insensitive search by email
      ],
    });

    // Return the matching users
    res.json({ users });
  } catch (error) {
    console.error('Error searching friends:', error);
    res.status(500).json({ message: 'Error searching friends' });
  }
});

// Get a user's friends
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID and populate the 'friends' field
    const user = await User.findById(userId).populate('friends', 'username');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ friends: user.friends });
  } catch (error) {
    console.error('Error retrieving user friends:', error);
    res.status(500).json({ message: 'Error retrieving user friends' });
  }
});

// Get a user's friend requests
router.get('/:userId/friend-requests', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user by ID and populate the 'friendRequests' field
      const user = await User.findById(userId).populate('friendRequests', 'senderName');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ friendRequests: user.friendRequests });
    } catch (error) {
      console.error('Error retrieving friend requests:', error);
      res.status(500).json({ message: 'Error retrieving friend requests' });
    }
  });

// Send a friend request
router.post('/:userId/requests', async (req, res) => {
  try {
    const { userId } = req.params;
    const { friendId } = req.body;

    // Check if the user and friend exist
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    // Check if the friend request already exists
    if (user.friendRequests.includes(friendId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }
    console.log(userId);
    // Add friendId to user's friendRequests array
    friend.friendRequests.push(userId);
    await friend.save();

    res.json({ message: 'Friend request sent' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Error sending friend request' });
  }
});

// Accept a friend request
router.post('/:userId/requests/:requestId/accept', async (req, res) => {
  try {
    const { userId, requestId } = req.params;

    // Find the user by ID and remove the friend request
    const user = await User.findById(userId);
    const friend = await User.findById(requestId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.friendRequests.indexOf(requestId);

    if (index === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Remove the friend request and add the friend
    user.friendRequests.splice(index, 1);
    user.friends.push(requestId);
    await user.save();
    friend.friends.push(user._id);
    await friend.save();

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Error accepting friend request' });
  }
})

// Reject a friend request
router.post('/:userId/requests/:requestId/reject', async (req, res) => {
    try {
      const { userId, requestId } = req.params;
  
      // Find the user by ID and remove the friend request
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const index = user.friendRequests.indexOf(requestId);
  
      if (index === -1) {
        return res.status(404).json({ message: 'Friend request not found' });
      }
  
      // Remove the friend request
      user.friendRequests.splice(index, 1);
      await user.save();
  
      res.json({ message: 'Friend request rejected' });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      res.status(500).json({ message: 'Error rejecting friend request' });
    }
  });
  
  module.exports = router;
  

