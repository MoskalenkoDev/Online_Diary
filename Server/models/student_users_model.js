const {Schema,model} = require('mongoose');

const student_users = new Schema({
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
  // activationLink : {
  //   type : String
  // },
  name: {
    type: String,
    default : ''
  },
  surname: {
    type: String,
    default : ''
  },
  lastName: {
    type : String,
    default : ''
  },
  phoneNumbers: {
    type : String,
    default : ''
  }
});

module.exports = student_user = model('student_users', student_users);