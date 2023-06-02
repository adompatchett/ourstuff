const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
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
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  author:{type:String,required:true},
  createdby:{type:String,required:true},
  likes:{type:Array,required:false},
  dislikes:{type:Array,required:false},
  tags:{
    type:String,
    required:false
  },
  views:{type:Array}
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;