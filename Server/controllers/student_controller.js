const argon2 = require('argon2');

const student_token_model = require("../models/student_token_model");
const student_users_model = require("../models/student_users_model");

const user_service = require('../service/user_service');
const ApiErrors = require('../exceptions/api_error');

class StudentController 
{


    async profile_post_data(req,res,next) {
        try {

            student_users_model.updateOne( {'email' : req.body.email} , { $set:req.body} ).exec(async(err, user_results) =>  {
                return res.sendStatus(200, 'OK');                                                 
            }); 
            
        }
        catch(e) {
            next(e);
        }
    }

}

module.exports = new StudentController();