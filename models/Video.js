const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdby:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:false
  },
  description:{
    type:String,
    required:false
  },
  filename:{
    type:String,
    required:true
  },
  likes:{type:Array,required:false},
  dislikes:{type:Array,required:false},
  tags:{
    type:String,
    required:false
  },
  views:{type:Array}
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
