const router = require('express').Router();
const class_schema = require('./Schemas/class_Schema');

router.route("/diary_menu/homework/delete_class").post(async function(req , res, next)
{
    try
    {
        const {_id} = req.body;

        await class_schema.deleteOne({"_id" : _id}).exec(async(err, info) => 
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