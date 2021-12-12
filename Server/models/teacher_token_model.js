const {Schema,model} = require('mongoose');

const teacher_token_schema = new Schema({
  user : {type : Schema.Types.ObjectId, ref: 'teacher_users'},
  refresh_token : {type: String, required : true}
});

module.exports = teacher_token = model('teacher_tokens', teacher_token_schema);