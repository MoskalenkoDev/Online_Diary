const uuid = require('uuid');
const {model} = require('mongoose');
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

const getUserTypeModel = (userType) => {

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
    return userTypeModel;
} 
class UserService {

    async user_signup(userType, email, password){

        let userTypeModel = getUserTypeModel(userType);
        
        const anotherModelFinded = await userTypeModel.anotherUserModel.findOne({"email" : email}).lean();
        const user = await userTypeModel.userModel.findOne({"email" : email}).lean();

        if(anotherModelFinded || user) throw ApiError.BadRequest("already registered user"); // должна отправится ошибка

        const activationLink = uuid.v4();
        try { 
           let result = await mail_service.sendMail(email, `${process.env.BACK_END_URL}/api/activate_mail/${activationLink}`); 
           console.log(result);
        }
        catch(e) {console.log(e);throw ApiError.MailFail("mailer can't send activation mail");}

        let userModel = await userTypeModel.userModel.create({email, password}); // all other params are defined in the model by default
        
        await user_activation_link_model.create({user_id : userModel._id, ability_type: `${userType}_users`, activation_link : activationLink});
        return true;
    }

    async activate_mail(activalionLink) { // we will add promise all in future

        const record = await user_activation_link_model.findOne({"activation_link" : activalionLink});
        if(!record) {throw new Error("")}

        const user = await model(record.ability_type).findById(record.user_id);
        user.isActivated = true; 
        await user.save();

        let userType = record.ability_type.split("_")[0];
        let userTypeModel = getUserTypeModel(userType);

        const userDto = new UserDto(user, userType);
        const tokens = token_service.generateTokens({...userDto});
        await token_service.saveToken(userTypeModel.tokenModel, userDto.id, tokens.refreshToken);

        await user_activation_link_model.deleteOne(record);

        return {tokens};
    }

    async user_login(userType, email, password) { // here we got plain password

        let userTypeModel = getUserTypeModel(userType);

        let user = await userTypeModel.userModel.findOne({email});

        if(!user) throw ApiError.BadRequest("unregistered user");
        if(!user.isActivated) throw ApiError.BadRequest("unconfirmed email");
        if(!await argon2.verify(user.password , password)) throw ApiError.BadRequest("incorrect password");
        
        const userDto = new UserDto(user, userType);
        const tokens = token_service.generateTokens({...userDto}); // вместо payload мы сюда будем передавать информацию о пользователе, где будет храниться в классе user.dto
        await token_service.saveToken(userTypeModel.tokenModel, userDto.id, tokens.refreshToken);
        return {...tokens};
    }

    async user_logout(userType,refreshToken) {

        if(!refreshToken) throw ApiError.BadRequest("missing refresh token");
        let userTypeModel = getUserTypeModel(userType);
        let token = await token_service.removeToken(userTypeModel.tokenModel, refreshToken);
        return token;
    }

    async user_refresh_token(refreshToken) {

        const userData = await token_service.validateRefreshToken(refreshToken); // here we got user data hashed inside token

        let userTypeModel = getUserTypeModel(userData.userType);

        if(!refreshToken) throw ApiError.UnauthorizedError();
        
        const tokenFromDB = await token_service.findToken(userTypeModel.tokenModel, refreshToken);

        if(!userData || !tokenFromDB) { throw ApiError.UnauthorizedError()}

        const user = await userTypeModel.userModel.findById(userData.id);
        const userDto = new UserDto(user, userData.userType); // we find it in DB because some data may have changed before token expired 
        const tokens = token_service.generateTokens({...userDto}); // вместо payload мы сюда будем передавать информацию о пользователе, где будет храниться в классе user.dto
        await token_service.saveToken(userTypeModel.tokenModel, userDto.id, tokens.refreshToken);
        return {...tokens}; 
    }

    async profile_get_data(userType , id) {

        let userTypeModel = getUserTypeModel(userType);
        let user_results = await userTypeModel.userModel.findById(id).lean();
        
        let result_obj = {...user_results};
        delete result_obj._id;
        delete result_obj.email;
        delete result_obj.password;
        delete result_obj.__v;
        delete result_obj.isActivated;
        return result_obj;                                                                       
    }

    async profile_put_data(userType, id , data) {

        let userTypeModel = getUserTypeModel(userType);
        const result = await userTypeModel.userModel.updateOne( {'_id' : id} , { $set: data} );
        return result;
    }

}

module.exports = new UserService();