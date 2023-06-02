const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const profileSchema = new mongoose.Schema({
    locked:{
        type:Boolean
      },
      blocked:{
        type:Boolean
      },
      blockeddate:{
        type:Date
    
      },
      blockedreason:{
        type:String
    
      },
    username:String,
    name: String,
    email: String,
    username: String,
    firstname: String,
    lastname: String,
    location: String,
    biography: String,
    website: String,
    joinedDate: Date,
    avatar: String,
    socialLinks: [{ name: String, url: String }],
    
  
});


const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;

