const router = require('express').Router();
const class_schema = require('./Schemas/class_Schema');

router.route("/diary_menu/homework/get_classes").post(async function(req , res, next)
{
    try
    {
        const {teacher_id} = req.body;

        await class_schema.find({"teacher_id" : teacher_id}).exec(async(err, classes) => 
        {
            if(classes === null) return res.status(201);
            else
            {
                let new_arr = [];
                classes.forEach((class_obj) => 
                {
                    let new_obj = {...class_obj};
                    delete new_obj._doc.teacher_id;
                    delete new_obj._doc.__v;
                    new_arr.push(new_obj._doc);
                });
                return res.status(200).send(new_arr);  
            }                                                                    
        });             

    }
    catch(e)
    {
        console.log(e, "УЖЕ ТУТ");
    }
    
});


module.exports = router;