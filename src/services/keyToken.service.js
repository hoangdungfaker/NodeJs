'use strict'

const { filter } = require("compression");
const keytokenModel = require("../models/keytoken.model");
const { token } = require("morgan");

class keyTokenService{
    // keyToken.service.js
static createKeyToken = async ({userId,publicKey, privateKey,refreshToken}) => {
    try {
        // level 0
        // const tokens = await keytokenModel.create({
        //     user: userId,
        //     publicKey,
        //     privateKey
        // })
        // return tokens ? publicKeyString : null;

        // level xx
        const filter = {user: userId},
        update = {publicKey, privateKey, refreshTokensUsed: [], refreshToken},
        options = {upsert: true, new: true}
        const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
        return tokens ? tokens.publicKey : null;
    } catch (error) {
        return error;
    }
}
    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user: userId}).lean();
    }
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({user: id});
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({
            refreshTokensUsed: refreshToken
        })
    }
    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({ user: userId });
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({refreshToken})
    }

}

module.exports = keyTokenService;