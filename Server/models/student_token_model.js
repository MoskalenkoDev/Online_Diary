const {Schema,model} = require('mongoose');

const student_token_schema = new Schema({
  user : {type : Schema.Types.ObjectId, ref: 'student_users'},
  refresh_token : {type: String, required : true}
});

module.exports = student_token = model('student_tokens', student_token_schema);