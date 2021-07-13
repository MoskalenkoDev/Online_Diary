const mongoose = require('mongoose');
const router = require('express').Router();
const teacher_user = require('./Schemas/teacher_users_Schema');
const student_user = require('./Schemas/student_users_Schema');

router.route("/diary_menu/profile").post(async function(req , res, next)
{
    try
    {
        const {login,status} = req.body;

        switch(status)
        {
            case "student" : 
            {
                await student_user.findOne({"login" : login}).exec(async(err, user_results) => 
                {
                    if(user_results === null) return res.status(201);
                    else
                    {
                        let result_obj = {...user_results._doc};
                        delete result_obj._id;
                        delete result_obj.login;
                        delete result_obj.password;
                        delete result_obj.__v;
                        return res.status(200).send(result_obj);  
                    }                                                                    
                });            
                break;
            }

            case "teacher" :
            {
                await teacher_user.findOne({"login" : login}).exec(async(err, user_results) => 
                {
                    if(user_results === null) return res.status(201);
                    else
                    {
                        let result_obj = {...user_results._doc};
                        delete result_obj._id;
                        delete result_obj.login;
                        delete result_obj.password;
                        delete result_obj.__v;
                        delete result_obj.share_link_id;
                        return res.status(200).send(result_obj);  
                    }                                                                    
                });    
                break;        
            }
        }
    }
    catch(e)
    {
        console.log(e, "УЖЕ ТУТ");
    }
    
});


module.exports = router;