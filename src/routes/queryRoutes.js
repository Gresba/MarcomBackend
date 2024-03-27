/**
 * Purpose: Store all the routes for queries
 * 
 * Author: Paul Kim
 * Last Modified: 3/5/2024
 * TO DO(s):
 * - Implement get query routes
 */
const express       = require('express');
const { getUserByUsername } = require('../database/userQueries');
const { createQuery, getQueriesBySellerId, getQueryById } = require('../database/queries');
const { jwtSellerAuthorization } = require('../requestFilters/security');
const { sendEmail } = require('../utils/emailer');
const { FRONT_END_URL } = require('../constants/config');
const { generateId } = require('../utils/generateId');

const queryRoutes = express.Router()

/**
 * Route to get all queries that belong to a seller by using the jwtSellerAuthorization filter
 */
queryRoutes.get("/", jwtSellerAuthorization, async(req, res) => {
    const user = req.decoded
    const userId = user.id;

    // Get all the queries that belong to the seller
    const response = await getQueriesBySellerId(userId)
    return res.status(200).send(response)
})

/**
 * Route to get a query by Id
 */
queryRoutes.get("/:queryId", async (req, res) => 
{
    try
    {
        const queryId = req.params.queryId;
        const query = await getQueryById(queryId)
        
        if(!query)
            return res.status(404).json({message: "Query not found"})
        return res.status(200).json(query)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'Could not retrieve query'})
    }
})

queryRoutes.post("/", async (req, res) => 
{
    const queryId = generateId(20)

    const newQuery = req.body
    const email = newQuery.Email;
    const reason = newQuery.Reason;

    if(!email || !reason || email === "" || reason === "")
    {
        return res.status(400).json({ message: "Missing Email or Reason"})
    }

    const seller = await getUserByUsername(newQuery.StoreName)
    
    if(!seller)
        return res.status(404).json({ message: "Invalid Store Name"})

    // Pull the seller id from the shop name
    newQuery.sellerId = seller.UserId

    await createQuery(queryId, newQuery)

    const emailMessage = `You contacted ${newQuery.StoreName}. View your conversation here ${FRONT_END_URL}/${newQuery.StoreName}/contact/${queryId}`

    await sendEmail(email, reason, emailMessage)

    res.status(200).send("Success")
})

module.exports = {
    queryRoutes
}