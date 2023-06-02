const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
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
  filename: String,
  path: String,
  originalname: String,
  createdby: String,
  title:{
    type:String,
    required:false
  },
  description:{
    type:String,
    required:false
  }, // Add the data field to store the photo data
  likes:{type:Array,required:false},
  dislikes:{type:Array,required:false},
  tags:{
    type:String,
    required:false
  },
  views:{type:Array}
});

module.exports = mongoose.model('Photo', photoSchema);