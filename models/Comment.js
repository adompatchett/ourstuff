const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  type:{
    type:String,
    required:true

  },
  bind:{
    type:String,
    required:true
    
  },
  replies:{
    type:Array,
    required:false
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;