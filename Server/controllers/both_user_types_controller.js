const argon2 = require('argon2');
const {validationResult} = require('express-validator');

const user_service = require("../service/user_service");
const ApiErrors = require('../exceptions/api_error');

class BothUserTypesContrioller {
    
    async user_signup(req,res,next) {
        try
        {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
               return next(ApiErrors.BadRequest('validation error', errors.array())); 
            }

            const {email, password} = req.body;
            let userType = req.baseUrl.slice(1);
            let hashedPassword = await argon2.hash(password);
            const userData = await user_service.user_signup(userType, email, hashedPassword);
            res.cookie('refreshToken',userData.refreshToken, {maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true});
            return res.json(userData);
        }
        catch(e) {
            next(e);
        }
    }

    async user_login(req,res,next) {
        try {
            const {email, password} = req.body;
            let userType = req.baseUrl.slice(1);
            const userData = await user_service.user_login(userType, email, password); // we pass plain password because we use argon2.verify() func 
            res.cookie('refreshToken', userData.refreshToken, {maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true});
            return res.json(userData);
        }
        catch(e) {
            next(e);
        }
    }

    async user_logout(req,res,next) {
        try {
            const {refreshToken} = req.cookies;
            let userType = req.baseUrl.slice(1);
            await user_service.user_logout(userType, refreshToken);
            res.clearCookie('refreshToken');
            res.sendStatus(200);
        }
        catch(e) {
            next(e);
        }
    }

    async user_refresh_token(req,res,next) {
        try {
            const {refreshToken} = req.cookies;
            let userType = req.baseUrl.slice(1);
            const userData = await user_service.user_refresh_token(userType, refreshToken);
            res.cookie('refreshToken',userData.refreshToken, {maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true});
            return res.json(userData);
        }
        catch(e) {
            next(e);
        }
    }

    async profile_get_data(req,res,next) { 
        try{
            const {id} = req.user; // по идее мы его передаем\
            let userType = req.baseUrl.slice(1);
            const userData = await user_service.profile_get_data(userType, id);
            return res.status(200).json(userData);
        }
        catch(e){
            next(e);
        }
    }

    async activate_mail(req,res,next) {
        try {
            const activationLink = req.params.link;
            await user_service.activate_mail(activationLink);
            return res.redirect(process.env.FRONT_END_URL)      
        }
        catch(e) {
            next(e);
        }

    }

    async profile_put_data(req,res,next) {
        try {
            const {id} = req.user;
            let userType = req.baseUrl.slice(1);
            await user_service.profile_put_data(userType, id, req.body);
            return res.sendStatus(200);
        }
        catch(e) {
            next(e);
        }
    }

}

module.exports = new BothUserTypesContrioller();