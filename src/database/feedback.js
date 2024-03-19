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
    const response = dbConnection.query(
        `INSERT INTO Feedback SET ?`, [feedback]
    )
    return response;
}

module.exports = {
    createFeedback
}