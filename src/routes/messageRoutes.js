const express       = require('express');
const { jwtSellerAuthorization } = require('../requestFilters/security');
const { getMessagesByQueryId, createMessage } = require('../database/message');
const { generateId } = require('../utils/generateId');

const messageRoutes = express.Router()

messageRoutes.get("/:queryId", jwtSellerAuthorization, async (req, res) => {
    const queryId = req.params.queryId;

    try{
        const messages = await getMessagesByQueryId(queryId)
        return res.status(200).json(messages)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Error getting messages"});
    }
})

messageRoutes.post("/:queryId", jwtSellerAuthorization, async (req, res) => {
    const queryId = req.params.queryId;
    const author = req.decoded.username;
    const content = req.body.Content

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