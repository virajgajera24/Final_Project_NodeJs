const mongoose = require("mongoose");

const course = new mongoose.Schema({
   name:{type:String},
   description:{type:String},
   duration:{type:Number},
   fees:{type:Number},
   languages:{type:Array}
  });

  module.exports = mongoose.model('course', course);