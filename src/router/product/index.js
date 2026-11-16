'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication ,authenticationV2} = require('../../auth/authUtils')
const router = express.Router()


// authentication
router.use(authentication)

router.post('',asyncHandler(productController.createProduct))
module.exports = router