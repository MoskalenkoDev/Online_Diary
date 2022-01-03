const jwt = require('jsonwebtoken');

class TokenService
{
    generateTokens(payload) {

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        };
    }

    async saveToken(tokenModel,userId, refreshToken) {

        const tokenData = await tokenModel.findOne({user : userId});
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return await tokenData.save();
        }
        const token = await tokenModel.create({user : userId, refresh_token : refreshToken});
        return token;
    }

}

module.exports = new TokenService();