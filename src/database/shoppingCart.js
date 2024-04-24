const { dbConnection } = require("./connection")

async function getShoppingCartByUserId(userId)
{
    const response = await dbConnection.query(
        `SELECT * FROM ShoppingCart
        WHERE CustomerId = ? AND InvoiceId IS NULL`, [userId]
    )
    return response[0][0]
}

async function getCartItemByProductIdAndCartId(productId, cartId)
{
    const response = await dbConnection.query(
        `SELECT * FROM ShoppingCartItem
        WHERE ProductId = ? AND CartId = ?`, [productId, cartId]
    )
    return response[0][0]
}

async function updateCartItem(column, value, id)
{
    await dbConnection.query(
        `UPDATE ShoppingCartItem
        SET ${column} = ?
        WHERE CartId = ?`, [value, id]
    )
}

async function createShoppingCart(shoppingCart)
{
    const response = dbConnection.query(
        `INSERT INTO ShoppingCart SET ?`, [shoppingCart]
    )
    return response;
}

async function getShoppingCartItemsByUserId(userId)
{
    const response = await dbConnection.query(
        `SELECT ShoppingCartItem.*, Product.*
        FROM ShoppingCart
        INNER JOIN ShoppingCartItem
        ON ShoppingCart.CartId = ShoppingCartItem.CartId
        INNER JOIN Product
        ON Product.ProductId = ShoppingCartItem.ProductId
        WHERE ShoppingCart.CustomerId = ?`, [userId]
    )
    return response[0]
}

async function createShoppingCartItem(shoppingCartItem)
{
    const response = dbConnection.query(
        `INSERT INTO ShoppingCartItem SET ?`, [shoppingCartItem]
    )
    return response;
}

async function deleteShoppingCartItemById(id)
{
    const response = await dbConnection.query(
        `DELETE FROM ShoppingCartItem
        WHERE CartItemId = ?`, [id]
    )
    return response[0]
}

module.exports = {
    updateCartItem,
    getCartItemByProductIdAndCartId,
    getShoppingCartByUserId,
    createShoppingCart,
    createShoppingCartItem,
    getShoppingCartItemsByUserId,
    deleteShoppingCartItemById
}