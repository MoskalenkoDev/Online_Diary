const {Schema,model} = require('mongoose');

const teacher_users = new Schema({
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

module.exports = teacher_user = model('teacher_users', teacher_users);