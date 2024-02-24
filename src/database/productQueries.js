const { generateId } = require("../utils/generateId")
const { dbConnection } = require("./connection")

async function createProduct(product, sellerId)
{
    try{
        const productId = generateId(16)

        const response = await dbConnection.query(
            `INSERT INTO Product (ProductId, Title, Description, ProductType, Price, Stock, SellerId)
            VALUES (?, ?, ?, ?, ?, ?, ?)`
        , [productId, product.title, product.description, product.productType, product.price, 0, sellerId])
        console.log(response)
        const sellerProduct = await dbConnection.query(
            `SELECT * FROM Seller`
        )
        console.log(sellerProduct[0])
        return response[0][0]
    }catch(err){
        console.log(err)
        return 500;
    }
}

async function getProductsBySellerEmail(sellerId)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM Product
             WHERE `
        )
    }catch(err){
        console.log(err)
        return 500;
    }
}

module.exports = {
    createProduct
}