const express       = require('express');
const { getUserByUsername } = require('../database/userQueries');
const { getProductsBySellerId } = require('../database/product');

const userRoutes    = express.Router()

userRoutes.get("/", async (req, res) => {
    res.send("User")
})

userRoutes.get("/:username/all", async (req, res) => {
    const username = req.params.username
    const user = await getUserByUsername(username)
    if(user)
    {
        const userId = user.UserId

        const response = await getProductsBySellerId(userId)
        res.status(200).send(response)
    }else{
        res.status(404).json({message: "No seller with that username."})
    }
})

module.exports = { userRoutes }