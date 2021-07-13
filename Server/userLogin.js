const mongoose = require('mongoose');
const router = require('express').Router();
const teacher_user = require('./Schemas/teacher_users_Schema');
const student_user = require('./Schemas/student_users_Schema');

router.route('/login').post(async function(req , res, next)
{
    try
    {
        const {login, password , status} = req.body;

        switch(status)
        {
            case "student" : 
            {
                await student_user.find({"login" : login ,"password" : password}).exec((err, user) => 
                {
                    if(user.length !== 0) return res.sendStatus(200, 'OK');
                    else return res.sendStatus(201);
                });
                break;
            }

            case "teacher" :
            {
                await teacher_user.find({"login" : login ,"password" : password}).exec((err, user) => 
                {
                    if(user.length !== 0) return res.sendStatus(200, 'OK');
                    else return res.sendStatus(201);
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