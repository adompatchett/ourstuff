const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friendRequests:{
    type:Array,
    required:false
  },
  likes:{type:Array,required:false},
  dislikes:{type:Array,required:false},
  profilepic:{type:String,required:false},
  profile:{type:Object,required:false},
  socialLinks: [{ name: String, url: String }],
  firstname: String,
    lastname: String,
    location: String,
    biography: String,
    website: String,
    joinedDate: Date,
    sub:{type:String},
    followers:{type:Array},
    following:{type:Array},
    notifications:{type:Array}
});


const User = mongoose.model('User', userSchema);

module.exports = User;