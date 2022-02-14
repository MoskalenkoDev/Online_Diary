const {Schema,model} = require('mongoose');

const class_schema = new Schema({
  teacher_id : { // id
    type: Schema.Types.ObjectId,
    required : true
  },
  title : { // 7 class or 9 class
    type: String,
    required : true
  },
  new_students : {type: [String],default : []}, // array contains only string type
  students: {type: [String],default : []}, // array contains only string type
  school_subjects : {type: [String],default : []},
});

module.exports = classes = model('classes', class_schema);