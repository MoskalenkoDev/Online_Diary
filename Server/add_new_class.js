const mongoose = require('mongoose');
const router = require('express').Router();
const md5 = require('md5');
const class_schema = require('./Schemas/class_Schema');

router.route('/diary_menu/homework/add_new_class').post(async function(req , res, next)
{
    try
    {
        const {teacher_id, title, school_subjects} = req.body;
        const class_params = 
        {
            teacher_id,
            title,
            new_students : [], 
            students: [], 
            school_subjects // array
        }

        let classModel = new class_schema(class_params);
        await classModel.save();
        return res.sendStatus(200, 'OK');

    }
    catch(e)
    {
        console.log(e, "УЖЕ ТУТ");
    }

});


module.exports = router;
