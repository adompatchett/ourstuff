const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
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
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdby:{
    type:String,
    required:false
  },
  likes:{type:Array,required:false},
  dislikes:{type:Array,required:false},
  tags:{
    type:String,
    required:false
  },
  views:{type:Array}
});

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;
