const router = require('express').Router();
const class_schema = require('./Schemas/class_Schema');

router.route("/diary_menu/homework/edit_class").post(async function(req , res, next)
{
    try
    {
        const {_id,title,school_subjects} = req.body;
        let update = 
        {
            title,
            school_subjects
        }
        await class_schema.updateOne({"_id" : _id},{ $set:update}).exec(async(err, info) => 
        {
            if(err) return res.sendStatus(201, "not ok");
            else return res.sendStatus(200, 'OK');                                                                  
        });             

    }
    catch(e)
    {
        console.log(e, "УЖЕ ТУТ");
    }
    
});


module.exports = router;