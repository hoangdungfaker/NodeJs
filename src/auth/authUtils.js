'use Strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const keyTokenService = require('../services/keyToken.service');
const { token } = require('morgan');
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESHTOKEN:'refreshtoken'
}
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) console.error('error verify::', err);
            else console.log('decode verify::', decode);
        });

        return { accessToken, refreshToken};
    } catch (error) {
        console.error(error);
        return null;
    }
}
const authenticationV2 = asyncHandler(async (req, res, next) => {
    
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid request ");

    //2. get accessToken
    const keyStore = await keyTokenService.findByUserId(userId);
    if (!keyStore) throw new NotFoundError("Not found keyStore");

    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshtoken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshtoken, keyStore.privateKey);
            if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid user");
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshtoken = refreshtoken;
            return next()
            
        } catch (error) {
            throw error;
        }
    }

})
const authentication = asyncHandler(async (req, res, next) => {
    /*
        1. check UserId missing
        2. get accessToken
        3. verify token
        4. check user in dbs
        5. check keyStore with userId
        6. go next()
    */
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError("Invalid request ");
    
    //2. get accessToken
    const keyStore = await keyTokenService.findByUserId(userId); // keyToken có thể tìm kiếm  bằng userId nhưng không lưu userId
    if (!keyStore) throw new NotFoundError("Not found keyStore");
    
    //3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError("Invalid request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid user");
        req.keyStore = keyStore
        req.userId = userId
        return next();
        
    } catch (error) {
        throw error;
    }
})
const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}