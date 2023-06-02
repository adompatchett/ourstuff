const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
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
  fileName: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    required:false
  },
  description:{
    type:String,
    required:false
  },
  originalName: {
    type: String,
    required: true,
  },
  createdby:{
    type:String,
    required:true

  },
  tags:{
    type:Array,
    required:false
  },
  likes:{type:Array,required:false},
  dislikes:{type:Array,required:false},
  views:{type:Array}
});

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;