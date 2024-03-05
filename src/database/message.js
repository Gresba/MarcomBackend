const { generateId } = require("../utils/generateId")
const { dbConnection } = require("./connection")
/**
 * The file is to store all the functions that run queries related to a Message
 * 
 * Author: Paul Kim
 * Last modified: 3/5/2024
 * To Do(s):
 */

/**
 * 
 */
async function createMessage(queryId, author, content)
{
    try{
        const messageId = generateId(20)

        const messageCreationDate = new Date();
        const response = await dbConnection.query(
            `INSERT INTO Message (MessageId, Author, Content, DateCreated, QueryId)
            VALUES (?, ?, ?, ?, ?)`, 
            [messageId, author, content, messageCreationDate, queryId]
        )
        console.log(response)
        return response[0]
    }catch(err){
        console.log(err)
        return 500;
    }
}

module.exports = {
    createMessage
}