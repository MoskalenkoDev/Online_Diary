const mongoose = require('mongoose');
const router = require('express').Router();
const md5 = require('md5');
const teacher_user = require('./Schemas/teacher_users_Schema');
const student_user = require('./Schemas/student_users_Schema');

router.route('/signup').post(async function(req , res, next)
{
    try
    {
        const {login, password, status} = req.body;

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
        const teacher_params = 
        {
            img_src : "",
            login : login,
            password : password,
            name : "",
            surname: "",
            lastName : "",
            school : "",
            school_subject : "",
            phoneNumbers : ""
        }

        switch(status)
        {
            case "student" :
            {
                await teacher_user.find({"login" : login}).exec(async(err1, user1) =>
                {
                    if(user1.length !== 0) return res.sendStatus(201 , "NEROOOOOO");
                    else 
                    {
                        await student_user.find({"login" : login}).exec(async(err, user) => 
                        {
                            if(err) return res.send('Error', "ТУТ ОШИБКА");
                            if(user.length !== 0) return res.sendStatus(201 , "NEROOOOOO");
                            else 
                            {
                                let userModel = new student_user(student_params);
                                await userModel.save();
                                return res.sendStatus(200, 'OK');
                            }
                        });
                    }
                });
                break;
            }
            case "teacher" :
            {
                await student_user.find({"login" : login}).exec(async(err1, user1) =>
                {
                    if(user1.length !== 0) return res.sendStatus(201 , "NEROOOOOO");
                    else 
                    {
                        await teacher_user.find({"login" : login}).exec(async(err, user) => 
                        {
                            if(err) return res.send('Error', "ТУТ ОШИБКА");
                            if(user.length !== 0) return res.sendStatus(201 , "NEROOOOOO");
                            else 
                            {
                                let userModel = new teacher_user(teacher_params);
                                await userModel.save();
                                return res.sendStatus(200, 'OK');
                            }
                        });
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
