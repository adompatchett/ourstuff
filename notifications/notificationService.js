// notificationService.js

// Import necessary modules and models
const User = require('../models/User');

// Function to send a notification to a user's followers
async function sendNotificationToFollowers(userId, notification) {
  try {
    // Get the user's followers from the database
    const user = await User.findById(userId).populate('followers');
    
    // Create a new notification object
    const newNotification = {
      message: notification,
      createdAt: new Date()
    };
    
    // Send the notification to each follower
    for (const follower of user.followers) {
      const followeruser = await User.findById(follower);
      console.log(followeruser);
      followeruser.notifications.push(newNotification);
      await followeruser.save();
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Export the notification functions
module.exports = {
  sendNotificationToFollowers
};