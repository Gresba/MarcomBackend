const express       = require('express');
const { jwtSellerAuthorization } = require('../requestFilters/security');
const { getSellerByEmail } = require('../database/sellerQueries');
const { createProduct, getProductsBySellerId, deleteProductById, getProductById } = require('../database/productQueries');
const { log } = require('../utils/consoleLogger');
/**
 * Contains all the routes for products
 * 
 * Author: Paul Kim
 * Last Modified: 2/26/2024
 * Notes: jwtSellerAuthorization is a guard for the routes. 
 *        It will check if someone is authorized to use route.
 * To Do(s):
 */

const productRoutes    = express.Router()

productRoutes.get("/", jwtSellerAuthorization, async(req, res) => {
    log("Attempted")
    const seller = req.decoded
    const sellerId = seller.id;

    const response = await getProductsBySellerId(sellerId)
    return res.status(200).send(response)
})

/**
 * This route does not need to be protected since it needs to be accessed when
 * customers view a seller's storefront
 */
productRoutes.get("/:productId", async (req, res) => {
    const productId = req.params.productId

    const product = await getProductById(productId)
    
    return res.status(200).json(product)
})

productRoutes.post("/", jwtSellerAuthorization, async (req, res) => {
    const product = req.body;
    const seller = req.decoded;
    
    if(!product)
    {
        return res.status(400).send("Missing Values")
    }

    const sellerId = seller.id

    const response = await createProduct(product, sellerId)
    if(response.affectedRows > 0)
    {
        return res.status(201).json(
            {
                message: "Created Product"
            }
        )
    }else{
        return res.status(response).json(
            {
                message: "Failed to create product"
            }
        )
    }
})

productRoutes.delete("/:productId", jwtSellerAuthorization, async (req, res) => {
    const productId = req.params.productId
    const seller = req.decoded

    const product = await getProductById(productId)
    if(product.SellerId === seller.id)
    {
        const response = await deleteProductById(productId)
        console.log(response)
        if(response[0].affectedRows > 0)
        {
            return res.status(200).json(
                {
                    rowsAffected: response[0].affectedRows,
                    message: "Product deleted"
                }
            )
        }else{
            return res.status(404).json(
                {
                    rowsAffected: response[0].affectedRows,
                    message: "Product Id not found"
                }
            )
        }
    }else{
        return res.status(403).json(
            {
                message: "Wrong owner"
            }
        )
    }
})

module.exports = { productRoutes }