const express       = require('express');
const { getUserByUsername, getAllMerchants } = require('../database/userQueries');
const { getProductsBySellerId } = require('../database/product');

const userRoutes    = express.Router()

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

userRoutes.get("/merchants", async (req, res) => {
    
    try{
        const merchants = await getAllMerchants()
        
        res.status(201).json(merchants)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
})


module.exports = { userRoutes }