'use strict'

const {OK, Created, SuccessResponse } = require("../core/sucess.response")
const AccessService = require("../services/access.service")

class AccessController {
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