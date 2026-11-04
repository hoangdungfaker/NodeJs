'use strict'
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const {findById} = require('../services/apikey.service')
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                code: 'xxx',
                message: 'Forbidden'
            })
        }
        // check key in database
        const objKey = await findById(key)
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
module.exports = {
    apiKey: apiKey,
    permission: permission
}