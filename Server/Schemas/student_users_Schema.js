const mongoose = require('mongoose');
const student_users = new mongoose.Schema({
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
  lastName: {
    type : String
  },
  phoneNumbers: {
    type : String
  }
});

module.exports = student_user = mongoose.model('student_users', student_users);