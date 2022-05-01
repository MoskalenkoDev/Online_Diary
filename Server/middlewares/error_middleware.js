const ApiError = require('../exceptions/api_error');

module.exports = function(err, req , res, next) {

    if(err instanceof ApiError) {
        return res.status(err.status).json({message : err.message, errors: err.errors});
    }
    else return res.status(500).json({message: "Unexpected error"});
}