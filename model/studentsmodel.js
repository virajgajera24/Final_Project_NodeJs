const mongoose = require("mongoose");

const student = new mongoose.Schema({
   name:{type:String},
   contact:{type:Number},
   dob:{type:Date},
   address:{type:String},
   coursename:{type: mongoose.Schema.Types.ObjectId,ref: "course"},
   pc_no:{type:String},
   startingdate:{type:Date, default:Date.now},
   endingdate:{type:Date},
   faculty_name:{type: mongoose.Schema.Types.ObjectId,ref: "members"},
   installment:{type:Array},
   results:{type:Array},
   average:{type:Number},
  });

module.exports = mongoose.model('student', student);