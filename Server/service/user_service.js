const uuid = require('uuid');
const {Schema,model} = require('mongoose');
const argon2 = require('argon2');

const ApiError = require('../exceptions/api_error');

const student_users_model = require('../models/student_users_model');
const student_token_model = require('../models/student_token_model');

const teacher_users_model = require('../models/teacher_users_model');
const teacher_token_model = require('../models/teacher_token_model');

const user_activation_link_model = require('../models/user_activation_link_model');

const mail_service = require('./mail_service');
const token_service = require('./token_service');
const UserDto = require('../dtos/user_dto');

class UserService {

    async user_signup(userType, email, password){

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

        const anotherModelFinded = await userTypeModel.anotherUserModel.findOne({"email" : email}).lean();
        const user = await userTypeModel.userModel.findOne({"email" : email}).lean();
        if(anotherModelFinded || user) throw ApiError.UnauthorizedError(); // должна отправится ошибка

        const activationLink = uuid.v4();
        try { await mail_service.sendMail(email, `${process.env.BACK_END_URL}/api/activate_mail/${activationLink}`); }
        catch(e) {throw ApiError.MailFail("mailer can't send activation mail");}

        let userModel = await userTypeModel.userModel.create({email, password}); // all other params are defined in the model by default
        
        await user_activation_link_model.create({user_id : userModel._id, ability_type: `${userType}_users`, activation_link : activationLink});
        
        const userDto = new UserDto(userModel);
        const tokens = token_service.generateTokens({...userDto}); // вместо payload мы сюда будем передавать информацию о пользователе, где будет храниться в классе user.dto
        await token_service.saveToken(userTypeModel.tokenModel, userDto.id, tokens.refreshToken);
        return {...tokens, user : userDto}; // res.sendStatus(200, 'OK')
    
    }

    async activate_mail(activalionLink){
        const record = await user_activation_link_model.findOne({"activation_link" : activalionLink});
        if(!record) {
            throw ApiError.MailFail("invalid activation link");
        }
        await model(record.ability_type).findById(record.user_id).exec(async(err,user)=>{ user.isActivated = true; await user.save(); });
        await user_activation_link_model.deleteOne(record);
    }

    async user_login(userType, email, password) { // here we got plain password

        let userTypeModel = {};
        switch(userType) { 
            case "student" : {
                userTypeModel.userModel = student_users_model;
                userTypeModel.tokenModel = student_token_model;
                break;
            }
            case "teacher" : {
                userTypeModel.userModel = teacher_users_model;
                userTypeModel.tokenModel = teacher_token_model;
                break;
            }
        }

        let user = await userTypeModel.userModel.findOne({email});

        if(!user) throw ApiError.BadRequest("user with this email is not registered");
        if(!user.isActivated) throw ApiError.BadRequest("unconfirmed email");
        if(!await argon2.verify(user.password , password)) throw ApiError.BadRequest("incorrect password");
        
        const userDto = new UserDto(user);
        const tokens = token_service.generateTokens({...userDto}); // вместо payload мы сюда будем передавать информацию о пользователе, где будет храниться в классе user.dto
        await token_service.saveToken(userTypeModel.tokenModel, userDto.id, tokens.refreshToken);
        return {...tokens, user : userDto};
    }

    async user_logout(userType,refreshToken) {

        if(!refreshToken) throw ApiError.UnauthorizedError();
        let user_token_model;
        switch(userType) {
            case "student" : {user_token_model = student_token_model; break;}
            case "teacher" : {user_token_model = teacher_token_model; break;}
        }
        let token = await token_service.removeToken(user_token_model, refreshToken);
        return token;
    }

    async user_refresh_token(userType , refreshToken) {

        let userTypeModel = {};
        switch(userType) { 
            case "student" : {
                userTypeModel.userModel = student_users_model;
                userTypeModel.tokenModel = student_token_model;
                break;
            }
            case "teacher" : {
                userTypeModel.userModel = teacher_users_model;
                userTypeModel.tokenModel = teacher_token_model;
                break;
            }
        }

        if(!refreshToken) throw ApiError.UnauthorizedError();
        const userData = await token_service.validateRefreshToken(refreshToken); // here we got user data hashed inside token
        const tokenFromDB = await token_service.findToken(userTypeModel.tokenModel, refreshToken);

        if(!userData || !tokenFromDB) { throw ApiError.UnauthorizedError()}

        const user = await userTypeModel.userModel.findById(userData.id);
        const userDto = new UserDto(user); // we find it in DB because some data may have changed before token expired 
        const tokens = token_service.generateTokens({...userDto}); // вместо payload мы сюда будем передавать информацию о пользователе, где будет храниться в классе user.dto
        await token_service.saveToken(userTypeModel.tokenModel, userDto.id, tokens.refreshToken);
        return {...tokens, user : userDto}; 
    }

    async profile_get_data(userType , id) {
        let userModel;
        switch(userType) { 
            case "student" : {
                userModel = student_users_model;
                break;
            }
            case "teacher" : {
                userModel = teacher_users_model;
                break;
            }
        }
        let user_results = await userModel.findById(id).lean();
        if(!user_results) throw ApiError.BadRequest('invalid id');
        
        let result_obj = {...user_results};
        delete result_obj._id;
        delete result_obj.email;
        delete result_obj.password;
        delete result_obj.__v;
        delete result_obj.isActivated;
        return result_obj;                                                                       
    }

    async profile_put_data(userType, id , data) {
        let userModel;

        switch(userType) { 
            case "student" : {
                userModel = student_users_model;
                break;
            }
            case "teacher" : {
                userModel = teacher_users_model;
                break;
            }
        }
        const result = await userModel.updateOne( {'_id' : id} , { $set: data} );
        return result;
    }

}

module.exports = new UserService();