'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication ,authenticationV2} = require('../../auth/authUtils')
const router = express.Router()

// signup 
router.post('/shop/signup',asyncHandler(accessController.signup))
router.post('/shop/login',asyncHandler(accessController.login))


// logout
router.post('/shop/logout',authentication, asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', authenticationV2, asyncHandler(accessController.handlerRefreshToken))
module.exports = router