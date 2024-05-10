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
const { createQuery, getQueryById, getQueriesBySellerId, getQueriesByCustomerEmail } = require('../database/queries');
const { jwtSellerAndCustomerAuthorization } = require('../requestFilters/security');
const { sendEmail } = require('../utils/emailer');
const { FRONT_END_URL, ROLES } = require('../constants/config');
const { generateId } = require('../utils/generateId');

const queryRoutes = express.Router()

/**
 * Route to get all queries that belong to a seller by using the jwtSellerAndCustomerAuthorization filter
 */
queryRoutes.get("/", jwtSellerAndCustomerAuthorization, async(req, res) => {
    const user = req.decoded
    const userId = user.id;
    const email = user.user;

    try
    {
        if(user.role === ROLES.SELLER)
        {
            // Get all the queries that belong to the seller
            const response = await getQueriesBySellerId(userId)
            return res.status(200).json(response)
        }else if(user.role === ROLES.CUSTOMER){
            // Get all the queries that belong to the seller
            const response = await getQueriesByCustomerEmail(email)
            return res.status(200).json(response)
        }
    }catch(err){
        console.log("Seller")

        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
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

queryRoutes.post("/", jwtSellerAndCustomerAuthorization, async (req, res) => 
{
    const queryId = generateId(20)

    const newQuery = req.body
    const email = newQuery.Email;
    const reason = newQuery.Reason;

    if(!reason || reason === "")
    {
        return res.status(400).json({ message: "Missing Email or Reason"})
    }

    const seller = await getUserByUsername(newQuery.StoreName)
    
    if(!seller)
        return res.statu(404).json({ message: "Invalid Store Name"})

    // Pull the seller id from the shop name
    newQuery.sellerId = seller.UserId

    await createQuery(queryId, newQuery)

    const inquiryLink = `${FRONT_END_URL}/customer/messages/${queryId}`
    const emailMessage = `You contacted ${newQuery.StoreName}. View your conversation here ${inquiryLink}`

    await sendEmail(email, reason, emailMessage)

    res.status(200).json({ message: "Success", link: inquiryLink })
})

module.exports = {
    queryRoutes
}