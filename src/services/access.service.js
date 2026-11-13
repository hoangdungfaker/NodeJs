    'use strict'
    const shopModel = require('../models/shop.model')
    const bcrypt = require('bcrypt')
    const crypto = require('crypto')
    const keyTokenService = require('./keyToken.service')
    const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { BadRequestError, ForbiddenError, AuthFailureError } = require('../core/error.response')
const { findByEMail } = require('./shop.service')
    const RoleShop = {
        SHOP: 'SHOP',
        WRITER: "WRITER",
        EDITOR: "EDITOR",
        ADMIN: ' ADMIN'
    }
    
class AccessService {
    /*
       check this token used
    */
    static handlerRefreshToken = async (refreshToken) => {
        const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            // decode (giai ma) may la thang nao
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email })
            
            // xoa accesstokenva refreshtoken
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError("SomeThing warn happend")
        }
        // tim kiem refreshtoken co trong db hay khong
        const holderToken = await keyTokenService.findByRefreshToken( refreshToken )
        if (!holderToken) throw new AuthFailureError("shop not registered")
        
        // verify Token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)

        // check UserId
        const foundShop = await findByEMail({email})
        if (!foundShop) throw new AuthFailureError("shop not registered 2")
        
        // create 1 cap token
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
        
        // update token
        holderToken.refreshToken = tokens.refreshToken;
        holderToken.refreshTokensUsed = [...holderToken.refreshTokensUsed, refreshToken];
        await holderToken.save();
        return {
            user: { userId, email },
            tokens
        }

    }

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id)
        return delKey;
    }
        /*
        1- check email in dbs
        2- match password
        3. create AT, RT and save
        4. generate tokens
        5. get data return login
        */
        static login = async ({ email, password, refreshToken = null }) => {
            const foundShop = await findByEMail({ email })
            if (!foundShop) throw new BadRequestError('Shop not registered')
            
            const match = await bcrypt.compare(password, foundShop.password)
            if (!match) throw new BadRequestError('Authentication error: password not match')
            
            const privateKey = crypto.randomBytes(64).toString('hex');
            const publicKey = crypto.randomBytes(64).toString('hex');

            const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

            await keyTokenService.createKeyToken({
                userId: foundShop._id,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            })
            return {
                shop: {
                    _id: foundShop._id,
                    email: foundShop.email,
                    name: foundShop.name,
                },
                tokens
            }
            
        }
   
        static signup = async ({ name, email, password }) => {
                // step1: check email exists
                const holderShop = await shopModel.findOne({ email}).lean()
                if (holderShop) {
                   throw new BadRequestError('Shop already registered')
                }
                const passwordHash = await bcrypt.hash(password, 10);
                const newShop = await shopModel.create({
                    name,
                    email,
                    password: passwordHash,
                    roles: [RoleShop.SHOP]
                })
                // nếu tạo thành công tạo ra một khóa  public , private
                if (newShop) {
                    //created privateKey (để cho người dùng chúng ta không lưu ( dùng để đăng ký  token )), publickey(xác nhận token)
                    // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    //     modulusLength: 4096,
                    //     publicKeyEncoding: { // hàm này để chuyển publicKey sang dạng string để lưu vào database
                    //         type: 'pkcs1',
                    //         format: 'pem'
                    //     },
                    //     privateKeyEncoding: { // hàm này để chuyển privateKey sang dạng string để lưu vào database
                    //         type: 'pkcs1', // định dạng của privateKey
                    //         format: 'pem' // định dạng của privateKey
                    //     }
                    // })
                    const privateKey = crypto.randomBytes(64).toString('hex');
                    const publicKey = crypto.randomBytes(64).toString('hex');

                    // hàm này để chuyển publicKey sang dạng string để lưu vào database
                    const keyStore = await keyTokenService.createKeyToken({
                        userId: newShop._id, 
                        publicKey,
                        privateKey
                    })
                    if (!keyStore) {
                        throw new BadRequestError('KeyStore error')
                    }

        
                    // tạo ra cập tokenPair (accessToken, refreshToken) để trả về cho người dùng
                    const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
    
                    console.log('Created Token Sucess::', tokens)
                    return {
                        code: 201,
                        metadata: {
                            _id: newShop._id,
                            email: newShop.email,
                            name: newShop.name,
                            roles: newShop.roles,
                        }
                    }
                }
                return {
                    code: 200,
                    metadata: null
                }

        }
    }
    module.exports = AccessService