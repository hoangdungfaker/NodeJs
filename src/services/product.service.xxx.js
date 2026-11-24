'use strict'

const { product, clothing, electronics, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const { findAllDraftsForShop, findAllPublishForShop,
    unPublishProductByShop, publishProductByShop,
    searchProductByUser
} = require('../models/repositories/product.repo')

// define Factory class to create product
class ProductFactory {
    // kho chua
    static productRegistry = {} // key-class

    // dang ky vao kho chua
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    // ham dieu phoi 
    static async createProduct(type, payload) {
        // lay class dua vao key da luu trog kho
        const productClass = ProductFactory.productRegistry[type]

        if (!productClass) throw new BadRequestError(`Invalid Product Types: ${type}`);

        return new productClass(payload).createProduct();
    }

    // query //
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }
     static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }



    // PUT

    //publish
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({product_shop, product_id})
    }
    
    //unPublish
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({product_shop, product_id})
    }

    // search product (ko can verify token)
    static async searchProducts({keySearch}) {
        return await searchProductByUser({keySearch})
    }




}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }
    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError("create new clothes error")

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError("create new product error")
        return newProduct;
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronics) throw new BadRequestError("create new Electronics error")

        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) throw new BadRequestError("create new product error")
        return newProduct;
    }
}

class Furnitures extends Product {
    async createProduct() {
        const newFurnitures = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurnitures) throw new BadRequestError("create new Furnitures error")

        const newProduct = await super.createProduct(newFurnitures._id)
        if (!newProduct) throw new BadRequestError("create new product error")
        return newProduct;
    }
}

// thuc hien dang ky
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furnitures);

module.exports = ProductFactory;
