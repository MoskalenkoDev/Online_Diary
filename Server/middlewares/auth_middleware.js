const ApiError = require('../exceptions/api_error');
const token_service = require('../service/token_service');

module.exports = function(req , res, next) {
    
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken) return next(ApiError.UnauthorizedError());

        const userData = token_service.validateAccessToken(accessToken);
        if(!userData) return next(ApiError.UnauthorizedError());

        req.user = userData;
        next();
    }
    catch(e) {
        next(ApiError.UnauthorizedError());
    }

}