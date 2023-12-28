const mongoose = require("mongoose");

const language = new mongoose.Schema({
   name:{type:String},
   duration:{type:Number},
   description:{type:String}
  });

module.exports = mongoose.model('language', language);