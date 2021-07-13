const mongoose = require('mongoose');
const class_schema = new mongoose.Schema({
  teacher_id : { // login
    type:String
  },
  title : { // 7 class or 9 class
    type: String
  },
  new_students : [String], // array contains only string type
  students: [String], // array contains only string type
  school_subjects : [String]
});

module.exports = classes = mongoose.model('classes', class_schema);