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
        return response[0][0]
    }catch(err){
        console.log(err)
        return 500;
    }
}

module.exports = {
    createProduct
}