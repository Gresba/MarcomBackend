const { generateId } = require("../utils/generateId")
const { dbConnection } = require("./connection")
/**
 * The file is to store all the functions that run creates related the products
 * 
 * Author: Paul Kim
 * Last modified: 2/26/2024
 * To Do(s):
 */

/**
 * Retrieve the products that being to a User
 * 
 * @param {*} sellerId The user id
 * @returns All products that belong to a user
 */
async function getProductsBySellerId(sellerId)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM Product
             WHERE SellerId = ?`, [sellerId]
        )
        return response[0]
    }catch(err){
        console.log(err)
        return 500;
    }
}

async function createProduct(product, sellerId)
{
    try{
        const productId = generateId(16)

        const response = await dbConnection.query(
            `INSERT INTO Product (ProductId, Title, Description, ProductType, Price, Stock, SellerId)
            VALUES (?, ?, ?, ?, ?, ?, ?)`
        , [productId, product.Title, product.Description, product.ProductType, product.Price, 0, sellerId])

        return response[0]
    }catch(err){
        console.log(err)
        console.log(err.errno)
        switch(err.errno)
        {
            case 1366:
                return 422
            default:
                return 500
            
        }
    }
}

/**
 * TO DO(s)
 *  - Implement stock updater
 * 
 * @param {*} productId 
 * @param {*} newProduct 
 */
async function updateProductById(productId, newProduct)
{
    const response = await dbConnection.query(
        `UPDATE Product
         SET Title = ?,
                Description = ?,
                ProductType = ?,
                DeliverySpeed = ?,
                DigitalType = ?,
                Price = ?
        WHERE ProductId = ?`, [newProduct.Title, newProduct.Description, newProduct.ProductType, newProduct.DeliverySpeed, newProduct.DigitalType, newProduct.Price, productId]
    )
    console.log(response)
}

/**
 * Get a product with the id
 * 
 * @param {*} productId The product id
 * @returns The product
 */
async function getProductById(productId)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM Product
            WHERE ProductId = ?`, [productId]
        )
        return response[0][0]
    }catch(err){
        console.log(err)
        return 500;
    }
}

async function deleteProductById(productId)
{
    try{
        const response = await dbConnection.query(
            `DELETE FROM Product
            WHERE ProductId = ?`, [productId]
        )
        console.log("DELETED")
        console.log(response)
        return response
    }catch(err){
        console.log(err)
        return 500;
    }
}

module.exports = {
    createProduct,
    getProductsBySellerId,
    deleteProductById,
    getProductById,
    updateProductById
}