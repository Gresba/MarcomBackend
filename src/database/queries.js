const { dbConnection } = require("./connection")
const { createMessage } = require("./message")
/**
 * The file is to store all the functions that run queries related to a Query
 * 
 * Author: Paul Kim
 * Last modified: 3/21/2024
 * To Do(s):
 */

/**
 * Retrieve the products that being to a User
 * 
 * @param {*} sellerId The user id
 * @returns All products that belong to a user
 */
async function getQueriesBySellerId(sellerId)
{
    const response = await dbConnection.query(
        `SELECT * FROM Query
        WHERE SellerId = ?`, [sellerId]
    )
    return response[0]
}

async function getQueriesByCustomerEmail(customerEmail)
{
    const response = await dbConnection.query(
        `SELECT * FROM Query
        WHERE Email = ?`, [customerEmail]
    )
    return response[0]
}

async function getQueryById(queryId)
{
    const response = await dbConnection.query(
        `SELECT * FROM Query
        WHERE QueryId = ?`, [queryId]
    )
    return response[0][0]
}

async function createQuery(queryId, newQuery)
{
    try{
        const response = await dbConnection.query(
            `INSERT INTO Query (QueryId, Email, QueryStatus, Reason, SellerId)
            VALUES (?, ?, ?, ?, ?)`, 
            [queryId, newQuery.Email, "Unresolved", newQuery.Reason, newQuery.sellerId]
        )

        await createMessage(queryId, newQuery.Email, newQuery.Content)
        return response[0]
    }catch(err){
        console.log(err)
        return 500;
    }
}

module.exports = {
    createQuery,
    getQueryById,
    getQueriesBySellerId,
    getQueriesByCustomerEmail
}