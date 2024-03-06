const express       = require('express');
const { jwtSellerAuthorization } = require('../requestFilters/security');
const { getMessagesByQueryId } = require('../database/message');

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

module.exports = {
    messageRoutes
}