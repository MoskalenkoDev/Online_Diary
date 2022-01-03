const student_token_model = require("../models/student_token_model");
const student_users_model = require("../models/student_users_model");

const user_service = require('../service/user_service');



class StudentController 
{

    async student_signup(req,res) {
        try
        {
            const {email, password} = req.body;

            const student_params = 
            {
                img_src : "",
                email : email,
                password : password,
                name : "",
                surname: "",
                lastName : "",
                phoneNumbers : ""
            }

            const userData = await user_service.user_signup("student", email, password, student_params);
            
            res.cookie('refreshToken',userData.refreshToken, {maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true});
            return res.json(userData);

        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

    async student_login(req,res) {
        try {
            const {email, password} = req.body;
            await student_users_model.find({"email" : email ,"password" : password}).exec((err, user) => {
                if(user.length !== 0) return res.sendStatus(200, 'OK');
                else return res.sendStatus(201);
            });
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

    async profile_get_data(req,res) { 
        try{
            await student_users_model.findOne({"email" : req.body.email}).exec(async(err, user_results) => {
                if(user_results === null) return res.status(201);
                else {
                    let result_obj = {...user_results._doc};
                    delete result_obj._id;
                    delete result_obj.email;
                    delete result_obj.password;
                    delete result_obj.__v;
                    return res.status(200).send(result_obj);  
                }                                                                    
            });            
        }
        catch(e){
            console.log(e, "УЖЕ ТУТ");
        }
    }

    async profile_post_data(req,res) {
        try {

            student_users_model.updateOne( {'email' : req.body.email} , { $set:req.body} ).exec(async(err, user_results) =>  {
                if(err) console.log(err);
                else return res.sendStatus(200, 'OK');                                                 
            }); 
            
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

}

module.exports = new StudentController();