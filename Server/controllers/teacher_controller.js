const class_model = require("../models/class_model");
const teacher_token_model = require("../models/teacher_token_model");
const teacher_users_model = require("../models/teacher_users_model");

const user_service = require('../service/user_service');

class TeacherController 
{

    async teacher_signup(req,res) {
        try
        {
            const {email, password} = req.body;

            const teacher_params = {
                img_src : "",
                email : email,
                password : password,
                name : "",
                surname: "",
                lastName : "",
                school : "",
                school_subject : "",
                phoneNumbers : ""
            }

            const userData = await user_service.user_signup("teacher", email, password, teacher_params);
            res.cookie('refreshToken',userData.refreshToken, {maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true});
            return res.json(userData);
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

    async teacher_login(req,res) {
        try {
            const {email, password} = req.body;
            await teacher_users_model.find({"email" : email ,"password" : password}).exec((err, user) => {
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
            await teacher_users_model.findOne({"email" : req.body.email}).exec(async(err, user_results) => {
                if(user_results === null) return res.status(201);
                else {
                    let result_obj = {...user_results._doc};
                    delete result_obj._id;
                    delete result_obj.email;
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

            teacher_users_model.updateOne( {'email' : req.body.email} , { $set:req.body} ).exec(async(err, user_results) =>  {
                if(err) console.log(err);
                else return res.sendStatus(200, 'OK');                                                 
            }); 
            
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

    async add_new_class(req , res) {
        try {
            const {teacher_id, title, school_subjects} = req.body;
            const class_params = {
                teacher_id,
                title,
                new_students : [], 
                students: [], 
                school_subjects // array
            }

            let classModel = new class_model(class_params);
            await classModel.save();
            return res.sendStatus(200, 'OK');
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

    // async activate_mail(req,res) {
    //     try {
    //         const {teacher_id} = req.body;
    //         const class_params = {
    //             teacher_id,
    //             title,
    //             new_students : [], 
    //             students: [], 
    //             school_subjects // array
    //         }

    //         let classModel = new class_model(class_params);
    //         await classModel.save();
    //         return res.sendStatus(200, 'OK');
    //     }
    //     catch(e) {
    //         console.log(e, "УЖЕ ТУТ");
    //     }
    // }

    // async get_refresh_token(req,res) {
    //     try {
    //         teacher_user.updateOne( {'email' : req.body.email} , { $set:req.body} ).exec(async(err, user_results) => {
    //             if(err) console.log(err);
    //             else return res.sendStatus(200, 'OK');                                                 
    //         }); 
            
    //     }
    //     catch(e) {
    //         console.log(e, "УЖЕ ТУТ");
    //     }
    // }

    async teacher_delete_class(req, res) {
        try {
            const {_id} = req.body;
    
            await class_model.deleteOne({"_id" : _id}).exec(async(err, info) => {
                if(err) return res.sendStatus(201, "not ok");
                else return res.sendStatus(200, 'OK');                                                                  
            });             
    
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }    
    }

    async teacher_edit_class(req,res) {
        try {
            const {_id,title,school_subjects} = req.body;
            let update = {
                title,
                school_subjects
            }
            await class_model.updateOne({"_id" : _id},{ $set:update}).exec(async(err, info) => {
                if(err) return res.sendStatus(201, "not ok");
                else return res.sendStatus(200, 'OK');                                                                  
            });             
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

    async teacher_get_classes(req,res) {
        try {
            const {teacher_id} = req.body;
    
            await class_model.find({"teacher_id" : teacher_id}).exec(async(err, classes) => {
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
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }
}

module.exports = new TeacherController();