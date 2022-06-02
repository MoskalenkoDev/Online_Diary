const { Schema, model } = require('mongoose');

const homework_tasks = new Schema({
    class_id: { // id
        type: Schema.Types.ObjectId,
        ref: 'classes', 
        required: true
    },
    school_subject: { 
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    date: {
        type: Schema.Types.Date,
        required: true
    }
});

module.exports = model('homework_tasks', homework_tasks);