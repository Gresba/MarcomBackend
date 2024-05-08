const { dbConnection } = require("./connection")

/**
 * This file will be used to store all the functions which will create queries related to invoices
 * 
 * Author:
 * Last modified: 3/10/2024
 * To Do(s):
 */

async function createFeedback(feedback)
{
    const response = await dbConnection.query(
        `INSERT INTO Feedback SET ?`, [feedback]
    )
    return response;
}

async function getFeedbackByProductId(productId)
{
    const response = await dbConnection.query(
        `SELECT Rating, DateCreated, Message, Title FROM Feedback
        WHERE ProductId = ?`, [productId]
    )
    return response[0]
}

async function getSellerByProductId(productId)
{
    const response = await dbConnection.query(
            `SELECT SellerUsername FROM Feedback
            WHERE ProductId = ?`, [productId]
        )
        return response[0]
}

async function getFeedbackByStoreName(storeName)
{
    const response = await dbConnection.query(
        `SELECT Rating, DateCreated, Message, Title FROM Feedback
        WHERE SellerUsername = ?
        ORDER BY DateCreated DESC`, [storeName]
    )

    return response[0]
}

module.exports = {
    createFeedback,
    getFeedbackByProductId,
    getFeedbackByStoreName,
    getSellerByProductId
}