const {Schema,model} = require('mongoose');

const users_activation_link = new Schema({

    user_id : {
        type : Schema.Types.ObjectId,
        required: true,
        refPath : 'ability_type'
    },
    ability_type : {
        type: String,
        required : true,
        enum : ['student_users','teacher_users']
    },
    activation_link : {
        type: String,
        required: true
    }
})

module.exports = user_activation_link = model('users_activation_link', users_activation_link);