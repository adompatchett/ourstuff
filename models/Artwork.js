const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
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
    type:String,

  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  filename:{
    type:String,
    required:true
  },
  originalName:{
    type:String,
    required:true
  },
  createdby:{
    type:String,
    required:false
  },
  tags:{
    type:Array,
    required:false
  },
  likes:{type:Array,required:false},
  dislikes:{type:Array,required:false},
  views:{type:Array}
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;