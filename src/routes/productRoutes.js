const express       = require('express');
const { jwtSellerAuthorization } = require('../requestFilters/security');
const { getSellerByEmail } = require('../database/sellerQueries');
const { createProduct } = require('../database/productQueries');

const productRoutes    = express.Router()

productRoutes.get("/", jwtSellerAuthorization, async(req, res) => {
    const seller = req.decoded
    if(!seller)
    {
        return res.status(401).send("Unauthorized")
    }
    const sellerEmail = seller.user;

})

productRoutes.post("/", jwtSellerAuthorization, async (req, res) => {
    const product = req.body;
    const seller = req.decoded;
    
    if(!product)
    {
        return res.status(409).send("Missing Values")
    }
    if(!seller)
    {
        return res.status(401).send("Unauthorized")
    }

    const sellerId = seller.id

    const reponse = await createProduct(product, sellerId)
})

module.exports = { productRoutes }