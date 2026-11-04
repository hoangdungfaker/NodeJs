'use strict'
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const {findById} = require('../services/apikey.service')
const apiKey = async (req, res, next) => {
    try {
        // phần này thì key vẫn là key của người dùng gửi lên
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                code: 'xxx',
                message: 'Forbidden'
            })
        }
        // check key in database
        const objKey = await findById(key)
        // phần này thì key đã bị ghi đè bằng crypto.randomBytes(64).toString('hex') trong hàm findById
        if (!objKey) {
            return res.status(403).json({
                code: 'xxx',
                message: 'Forbidden'
            })
        }
        req.objKey = objKey  // Them object key vao request de su dung cho cac middleware sau
        return next()
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            code: 'xxx',
            message: 'Internal server error'
        })
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                code: 'xxx',
                message: 'permission denied'
            })
        }
        const hasPermission = req.objKey.permissions.includes(permission);
        if (!hasPermission) {
            return res.status(403).json({
                code: 'xxx',
                message: 'permission denied'
            })
        }
        return next()

    }
}

const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    };
}
module.exports = {
    apiKey: apiKey,
    permission: permission,
    asyncHandler: asyncHandler
}