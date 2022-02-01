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

    async removeToken(tokenModel, refreshToken) {
        let token = await tokenModel.deleteOne({refreshToken});
        return token;
    }

    async findToken(tokenModel, refreshToken) {
        let token = await tokenModel.findOne({refreshToken});
        return token;
    }

    async validateAccessToken(token) {
        try {
            const userData = jwt.verify(token , process.env.JWT_ACCESS_SECRET);
            return userData;
        }
        catch(e) {
            return null;
        }
    }

    async validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token , process.env.JWT_REFRESH_SECRET);
            return userData;
        }
        catch(e) {
            return null;
        }
    }
}

module.exports = new TokenService();