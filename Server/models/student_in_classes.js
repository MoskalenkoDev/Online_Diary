const { Schema, model } = require('mongoose');

const student_in_classes = new Schema({
    student_id: { // id
        type: Schema.Types.ObjectId,
        ref: 'student_users', 
        required: true
    },
    classes: { 
        type: [Schema.Types.ObjectId],
        ref: "classes", // where we have already joined
        default: []
    },
    requests_to_join: {
        type: [Schema.Types.ObjectId],
        ref: "classes", // where we sent our request to join
        default: []
    }
});

module.exports = model('student_in_classes', student_in_classes);