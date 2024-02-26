const { generateId } = require("../utils/generateId")
const { dbConnection } = require("./connection")

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
        , [productId, product.title, product.description, product.productType, product.price, 0, sellerId])

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
    getProductById
}