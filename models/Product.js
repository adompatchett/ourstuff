const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdby:{
    type:String,
    required:false
  },
  image:{
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;