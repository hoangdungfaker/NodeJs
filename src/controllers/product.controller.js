'use strict'
const ProductServiceV2 = require("../services/product.service.xxx")
const { SuccessResponse } = require("../core/sucess.response")

class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user ? req.user.userId : req.userId
            })
        }).send(res)
    }

    // PUT //
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'publish Product success!',
            metadata: await ProductServiceV2.publishProductByShop( {
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
        
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "unPublish Product success",
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    //*END PUT



    // QUERY //
    /**
     * 
     * @param {Number} limit
     * @param {Number} skip
     * @param {JSON} query
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish success!',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }
    // END QUERY //
}

module.exports = new ProductController();
