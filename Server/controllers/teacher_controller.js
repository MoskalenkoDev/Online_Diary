const class_model = require("../models/class_model");
const teacher_token_model = require("../models/teacher_token_model");
const teacher_users_model = require("../models/teacher_users_model");
const student_users_model = require("../models/student_users_model");

class TeacherController 
{

    async teacher_signup(req,res) {
        try
        {
            const {login, password} = req.body;

            const teacher_params = {
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

            await student_users_model.find({"login" : login}).exec(async(err1, user1) => {

                if(user1.length !== 0) return res.sendStatus(201 , "NEROOOOOO");
                else {
                    await teacher_users_model.find({"login" : login}).exec(async(err, user) => {
                        if(err) return res.send('Error', "ТУТ ОШИБКА");
                        if(user.length !== 0) return res.sendStatus(201 , "NEROOOOOO");
                        else {
                            let userModel = new teacher_users_model(teacher_params);
                            await userModel.save();
                            return res.sendStatus(200, 'OK');
                        }
                    });
                }
            });
        }
        catch(e) {
            console.log(e, "УЖЕ ТУТ");
        }
    }

    async teacher_login(req,res) {
        try {
            const {login, password} = req.body;
            await teacher_users_model.find({"login" : login ,"password" : password}).exec((err, user) => {
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
            await teacher_users_model.findOne({"login" : req.body.login}).exec(async(err, user_results) => {
                if(user_results === null) return res.status(201);
                else {
                    let result_obj = {...user_results._doc};
                    delete result_obj._id;
                    delete result_obj.login;
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

            teacher_users_model.updateOne( {'login' : req.body.login} , { $set:req.body} ).exec(async(err, user_results) =>  {
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
    //         teacher_user.updateOne( {'login' : req.body.login} , { $set:req.body} ).exec(async(err, user_results) => {
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