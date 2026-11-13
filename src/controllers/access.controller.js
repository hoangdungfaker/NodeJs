'use strict'

const {OK, Created, SuccessResponse } = require("../core/sucess.response")
const AccessService = require("../services/access.service")

class AccessController {
    async handlerRefreshToken(req, res, next) {
        new SuccessResponse({
            message: "get token success",
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res)
    }
    async logout(req, res, next) {
        new SuccessResponse({
            message: "Logout success",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    async login(req, res, next) {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)    
    }
    async signup(req, res, next) {
        new Created({
            message: 'Signup success',
            metadata: await AccessService.signup(req.body)
        }).send(res)
    }

}

module.exports = new AccessController()