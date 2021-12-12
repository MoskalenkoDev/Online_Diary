const {Schema,model} = require('mongoose');

const student_users = new Schema({
  img_src : {
    type:String
  },
  login: { 
    type: String,
    unique : true,
    required : true 
  },
  password: {
    type: String,
    required : true
  },
  isActivated : {
    type : Boolean,
    default : false
  },
  activationLink : {
    type : String
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

module.exports = student_user = model('student_users', student_users);