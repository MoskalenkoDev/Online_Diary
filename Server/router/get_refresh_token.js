const router = require('express').Router();

router.route("/refresh").post(async function(req , res, next)
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

module.exports = router;