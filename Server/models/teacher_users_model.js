const {Schema,model} = require('mongoose');

const teacher_users = new Schema({
  img_src : {
    type:String,
    default : ''
  },
  email: { 
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
  name: {
    type: String,
    default : ''
  },
  surname: {
    type: String,
    default : ''
  },
  lastName : {
    type : String,
    default : ''
  },
  school : {
    type: String,
    default : ''
  },
  school_subject : {
    type : String,
    default : ''
  },
  phoneNumbers : {
    type : String,
    default : ''
  }
});

module.exports = teacher_user = model('teacher_users', teacher_users);