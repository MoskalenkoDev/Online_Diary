const mongoose = require('mongoose');
const teacher_users = new mongoose.Schema({
  img_src : {
    type:String
  },
  login: {
    type: String
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  surname: {
    type: String
  },
  lastName : {
    type : String
  },
  school : {
    type: String
  },
  school_subject : {
    type : String
  },
  phoneNumbers : {
    type : String
  }
});

module.exports = teacher_user = mongoose.model('teacher_users', teacher_users);