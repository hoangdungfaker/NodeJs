    'use strict'
    const shopModel = require('../models/shop.model')
    const bcrypt = require('bcrypt')
    const crypto = require('crypto')
    const keyTokenService = require('./keyToken.service')
    const { createTokenPair } = require('../auth/authUtils')

    const RoleShop = {
        SHOP: 'SHOP',
        WRITER: "WRITER",
        EDITOR: "EDITOR",
        ADMIN: ' ADMIN'
    }
    class AccessService {
        static signup = async ({ name, email, password }) => {
            try {
                // step1: check email exists
                const holderShop = await shopModel.findOne({ email}).lean()
                if (holderShop) {
                    return {
                        code: 'xxx',
                        message: 'Shop already registered'
                    }
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
                    const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                        modulusLength: 4096,
                        publicKeyEncoding: { // hàm này để chuyển publicKey sang dạng string để lưu vào database
                            type: 'pkcs1',
                            format: 'pem'
                        },
                        privateKeyEncoding: { // hàm này để chuyển privateKey sang dạng string để lưu vào database
                            type: 'pkcs1', // định dạng của privateKey
                            format: 'pem' // định dạng của privateKey
                        }
                    })
                    console.log({ privateKey, publicKey })
                    // hàm này để chuyển publicKey sang dạng string để lưu vào database
                    const publicKeyString = await keyTokenService.createKeyToken({
                        userId: newShop._id, 
                        publicKey
                    })
                    if (!publicKeyString) {
                        return {
                            code: 'xxx',
                            message : 'publicKeyString error'
                        }
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

            } catch (error) {
                return {
                    code: 'xxx',
                    message: error.message,
                    status: 'error'
                }

            }
        }
    }
    module.exports = AccessService