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

    async saveToken(tokenModel,userId, refresh_token) {

        const tokenData = await tokenModel.findOne({user : userId});
        if(tokenData) {
            tokenData.refresh_token = refresh_token;
            return await tokenData.save();
        }
        const token = await tokenModel.create({user : userId, refresh_token});
        return token;
    }

    async removeToken(tokenModel, refresh_token) { 
        let token = await tokenModel.deleteOne({refresh_token});
        return token;
    }

    async findToken(tokenModel, refresh_token) {
        let token = await tokenModel.findOne({refresh_token});
        return token;
    }

    async validateAccessToken(token) {
        try {
            const userData = await jwt.verify(token , process.env.JWT_ACCESS_SECRET);
            return userData;
        }
        catch(e) {
            return null;
        }
    }

    async validateRefreshToken(token) {
        try {
            const userData = await jwt.verify(token , process.env.JWT_REFRESH_SECRET);
            return userData;
        }
        catch(e) {
            return null;
        }
    }
}

module.exports = new TokenService();