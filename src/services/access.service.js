'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: ' ADMIN'
}
class AccessService {
    static signup = async ({
        name,
        email,
        password
    }) => {
        try {
            // step1: check email exists
            const holderShop = await shopModel.findOne({
                email
            }).lean()
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
            // nếu tạo thành công tạo ra một token public , private
            if (newShop) {
                //created privateKey (để cho người dùng chúng ta không lưu ( dùng để sai token )), publickey(xác nhận token)
                const {
                    privateKey,
                    publicKey
                } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })
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