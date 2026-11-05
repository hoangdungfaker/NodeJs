'use strict'

const { Created } = require("../core/sucess.response")
const AccessService = require("../services/access.service")

class AccessController {
    async signup(req, res, next) {
        new Created({
            message: 'Signup success',
            metadata: await AccessService.signup(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()