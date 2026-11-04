'use strict'
const express = require('express')
const { apiKey , permission} = require('../auth/checkAuth')
const router = express.Router()


// check api key
router.use(apiKey)
// check permission
router.use(permission('0001'))
router.use('/v1/api', require('./access/index'))
// xu ly hander error
router.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
router.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: error.message
    })
})

module.exports = router;