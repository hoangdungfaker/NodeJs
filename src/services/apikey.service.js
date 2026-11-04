'use strict'
const apiKeyModel = require('../models/apikey.model')
const crypto = require('crypto')

const findById = async (key) => {
    key = crypto.randomBytes(64).toString('hex');
    const newKey = await apiKeyModel.create({ key: key , status:true, permission: ['0001'] })
    console.log('newKey', newKey)

    const objKey = await apiKeyModel.findOne({ key, status: true }).lean()
    return objKey
}
module.exports = {
    findById
}