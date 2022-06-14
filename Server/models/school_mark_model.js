const { Schema, model } = require('mongoose');

const school_mark = new Schema({
    class_id: { // id
        type: Schema.Types.ObjectId,
        ref: 'classes', 
        required: true
    },
    student_id: {
        type: Schema.Types.ObjectId,
        ref: "student_users",
        required: true
    },
    school_subject: { 
        type: String,
        required: true
    },
    marks: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Schema.Types.Date,
        required: true
    }
});

module.exports = model('school_marks', school_mark);