const express       = require('express');
const { jwtSellerAndCustomerAuthorization } = require('../requestFilters/security');
const { getMessagesByQueryId, createMessage } = require('../database/message');
const { queryAuthorizationFilter } = require('../requestFilters/messageFilters');
const { getQueryById } = require('../database/queries');
const { ROLES } = require('../constants/config');
const { getUserById } = require('../database/userQueries');

const messageRoutes = express.Router()

// Get all the messages that belong to a query.
messageRoutes.get("/:queryId", async (req, res) => {
    const queryId = req.params.queryId;

    try{
        // Get messages from the database
        const messages = await getMessagesByQueryId(queryId)

        // If there are no messages then return a 404
        if(messages.length === 0)
        {
            return res.status(404).json(
                {
                    message: "Query Not Found"
                })
        }

        // If there are no issues with retrieving the messages, return a 200
        return res.status(200).json(messages)

    // If there are any errors return a 500
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Error getting messages"});
    }
})

// Route to post new messages to a query
messageRoutes.post("/:queryId", queryAuthorizationFilter, async (req, res) => 
{
    const queryId = req.params.queryId;
    const content = req.body.Content
    const user = req.decoded

    let author;

    let query = await getQueryById(queryId);

    if(!query)
    {
        return res.status(404).json({message: "Query not found"})
    }

    if(!content || content === "")
    {
        return res.status(400).json({message: "No content"})
    }

    if(user.role === ROLES.CUSTOMER)
    {
        author = query.Email
    }else if(user.role === ROLES.SELLER){
        const seller = await getUserById(query.SellerId)
        author = seller.Username;
    }



    try{
        await createMessage(queryId, author, content)

        return res.status(200).json({message: "Successfully created message!"})
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Creating message"});
    }
})

module.exports = {
    messageRoutes
}