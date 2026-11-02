'use strict'

const keytokenModel = require("../models/keytoken.model");

class keyTokenService{
    // keyToken.service.js
static createKeyToken = async ({userId,publicKey}) => {
    try {
        const publicKeyString = publicKey.toString();
        const tokens = await keytokenModel.create({
            user: userId,
            publicKey: publicKeyString
        })
        return tokens ? publicKeyString : null;
    } catch (error) {
        return error;
    }
}

}

module.exports = keyTokenService;