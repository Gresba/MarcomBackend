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

async function getProductPriceByProductId(productId)
{
    const response = await dbConnection.query(
        `SELECT Price FROM Product
         WHERE ProductId = ?`, [productId]
    )
    return response[0][0].Price
}

async function getAllProductContaining(query)
{
    const response = await dbConnection.query(
        `SELECT Product.*, User.Username
        FROM Product
        INNER JOIN User
        ON Product.UserId = User.UserId
        WHERE Product.Title LIKE ?`, [query]
    )
    console.log(response)
    return response[0];
}

async function createProduct(product)
{
    try{
        const response = await dbConnection.query(
            `INSERT INTO Product SET ?`
        , [product])

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
                Price = ?,
                Stock = ?
        WHERE ProductId = ?`, [newProduct.Title, newProduct.Description, newProduct.ProductType, newProduct.DeliverySpeed, newProduct.DigitalType, newProduct.Price, newProduct.Stock, productId]
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

async function getAllProducts()
{
    const response = await dbConnection.query(
        `SELECT * FROM Product`
    )
    console.log(response[0])
    return response[0];
}


module.exports = {
    getProductPriceByProductId,
    createProduct,
    getProductsBySellerId,
    deleteProductById,
    getProductById,
    updateProductById,
    getAllProductContaining,
    getAllProducts
}