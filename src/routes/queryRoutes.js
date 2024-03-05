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
const { createQuery } = require('../database/queries');

const queryRoutes = express.Router()

queryRoutes.get("/", async (req, res) => {
    res.status(200).json(
        {
            status: "Success"
        }
    )
})

queryRoutes.post("/", async (req, res) => {
    const newQuery = req.body

    const seller = await getUserByUsername(newQuery.StoreName)
    
    if(!seller)
        return res.status(404).json({ message: "Invalid Store Name"})

    // Pull the seller id from the shop name
    newQuery.sellerId = seller.UserId
    console.log(seller)
    console.log(newQuery)

    const response = await createQuery(newQuery)
    console.log(response)

    res.send("Success")
})

module.exports = {
    queryRoutes
}