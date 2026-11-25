'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()
// seach product
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProudcts))
router.get('/:product_id', asyncHandler(productController.findProduct))


// authentication //
router.use(authenticationV2)
///////////////////
router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unPublish/:id', asyncHandler(productController.unPublishProductByShop))

// QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router
