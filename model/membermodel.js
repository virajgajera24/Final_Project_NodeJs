const mongoose = require("mongoose");

const members = new mongoose.Schema({
    name:{type:String},
    contact:{type:String},
    email:{type:String},
    password:{type:String},
    role:{type:String}
  });

module.exports = mongoose.model('members', members);