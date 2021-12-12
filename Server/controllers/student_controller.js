const student_token_model = require("../models/student_token_model");
const student_users_model = require("../models/student_users_model");
const teacher_users_model = require("../models/teacher_users_model");

class StudentController 
{

    async student_signup(req,res) {
        try
        {
            const {login, password} = req.body;

            const student_params = 
            {
                img_src : "",
                login : login,
                password : password,
                name : "",
                surname: "",
                lastName : "",
                phoneNumbers : ""
            }

            await teacher_users_model.find({"login" : login}).exec(async(err1, user1) => {

                if(user1.length !== 0) return res.sendStatus(201 , "NEROOOOOO");
                else {
                    await student_users_model.find({"login" : login}).exec(async(err, user) => {
                        if(err) return res.send('Error', "ТУТ ОШИБКА");
                        if(user.length !== 0) return res.sendStatus(201 , "NEROOOOOO");
                        else {
                            let userModel = new student_users_model(student_params);
                            await userModel.save();
                            return res.sendStatus(200, 'OK');
                        }
                    });
                }
            });
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

    async student_login(req,res) {
        try {
            const {login, password} = req.body;
            await student_users_model.find({"login" : login ,"password" : password}).exec((err, user) => {
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
            await student_users_model.findOne({"login" : req.body.login}).exec(async(err, user_results) => {
                if(user_results === null) return res.status(201);
                else {
                    let result_obj = {...user_results._doc};
                    delete result_obj._id;
                    delete result_obj.login;
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

            student_users_model.updateOne( {'login' : req.body.login} , { $set:req.body} ).exec(async(err, user_results) =>  {
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