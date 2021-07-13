const mongoose = require('mongoose');
const router = require('express').Router();
const teacher_user = require('./Schemas/teacher_users_Schema');
const student_user = require('./Schemas/student_users_Schema');

router.route("/diary_menu/profile/teacher/save_input_data").post(async function(req , res, next)
{
    try
    {
        teacher_user.updateOne( {'login' : req.body.login} , { $set:req.body} ).exec(async(err, user_results) => 
        {
            if(err) console.log(err);
            else return res.sendStatus(200, 'OK');                                                 
        }); 
        
    }
    catch(e)
    {
        console.log(e, "УЖЕ ТУТ");
    }
    
});

router.route("/diary_menu/profile/student/save_input_data").post(async function(req , res, next)
{
    try
    {
        student_user.updateOne( {'login' : req.body.login} , { $set:req.body} ).exec(async(err, user_results) => 
        {
            if(err) console.log(err);
            else return res.sendStatus(200, 'OK');                                                 
        }); 
        
    }
    catch(e)
    {
        console.log(e, "УЖЕ ТУТ");
    }
    
});

module.exports = router;