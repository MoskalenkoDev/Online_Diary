const uuid = require('uuid');
const argon2 = require('argon2');
const student_users_model = require('../models/student_users_model');
const student_token_model = require('../models/student_token_model');

const teacher_users_model = require('../models/teacher_users_model');
const teacher_token_model = require('../models/teacher_token_model');

const user_activation_link_model = require('../models/user_activation_link_model');

const mail_service = require('./mail_service');
const token_service = require('./token_service');
const UserDto = require('../dtos/user_dto');

class UserService {

    async user_signup(userType, email, password, params){

        let userTypeModel = {};

        switch(userType) { 
            case "student" : {
                userTypeModel.userModel = student_users_model;
                userTypeModel.tokenModel = student_token_model;
                userTypeModel.anotherUserModel = teacher_users_model;
                break;
            }
            case "teacher" : {
                userTypeModel.userModel = teacher_users_model;
                userTypeModel.tokenModel = teacher_token_model;
                userTypeModel.anotherUserModel = student_users_model;
                break;
            }
        }
        if(Object.keys(userTypeModel).length === 0) return; //res.sendStatus(401)
        await userTypeModel.anotherUserModel.find({"email" : email}).exec(async(err1, user1) => {

            if(user1.length !== 0) return; //res.sendStatus(201 , "NEROOOOOO")
            else {
                await userTypeModel.userModel.find({"email" : email}).exec(async(err, user) => {
                    if(user.length !== 0) return; // res.sendStatus(201 , "NEROOOOOO")
                    else {
                        let hashedPassword = await argon2.hash(password);
                        let userModel = await userTypeModel.userModel.create({...params, password: hashedPassword});
                        
                        // тут будем проверять, есть ли уже запись в таблице активаций ссылок, если нет - запишем, если есть то отправим еще раз со ссылкой с бд
                        const activationLink;
                        await user_activation_link_model.findOne({user_id: userModel._id}).exec(async(err,user_activation_link) => {
                            if(!user_activation_link) activationLink = user_activation_link.activalion_link;
                            else {
                                activalionLink = uuid.v4();
                                user_activation_link_model.create({user_id : userModel._id, ability_type: `${userType}_users`, activalion_link : activalionLink});
                            }
                        });
                        
                        await mail_service.sendMail(email, `${process.env.API_URL}/api/activate_mail/${activationLink}`);

                        const userDto = new UserDto(userModel);
                        const tokens = token_service.generateTokens({...userDto}); // вместо payload мы сюда будем передавать информацию о пользователе, где будет храниться в классе user.dto
                        await token_service.saveToken(userTypeModel.tokenModel, userDto.id, tokens.refreshToken);
                        return {...tokens, user : userDto}; // res.sendStatus(200, 'OK')
                    }
                });
            }
        });

    }

    async activate(userModel,activalionLink){
        const user = await userModel.findOne({activalionLink});
        if(!user) {
            throw new Error('Некорректная ссылка для активации');
        }
        user.isActivated = true;
        user.save();
    }
}

module.exports = new UserService();