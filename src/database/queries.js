const { generateId } = require("../utils/generateId")
const { dbConnection } = require("./connection")
const { createMessage } = require("./message")
/**
 * The file is to store all the functions that run queries related to a Query
 * 
 * Author: Paul Kim
 * Last modified: 3/5/2024
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
    try{
        const response = await dbConnection.query(
            `SELECT * FROM Query
             WHERE SellerId = ?`, [sellerId]
        )
        return response[0]
    }catch(err){
        console.log(err)
        return 500;
    }
}

/**
 * 
 */
async function createQuery(newQuery)
{
    try{
        const queryId = generateId(20)

        const response = await dbConnection.query(
            `INSERT INTO Query (QueryId, Email, QueryStatus, Reason, SellerId)
            VALUES (?, ?, ?, ?, ?)`, 
            [queryId, newQuery.Email, "Unresolved", newQuery.Reason, newQuery.sellerId]
        )
        console.log(response)
        await createMessage(queryId, newQuery.Email, newQuery.Content)
        return response[0]
    }catch(err){
        console.log(err)
        return 500;
    }
}

module.exports = {
    createQuery,
    getQueriesBySellerId
}