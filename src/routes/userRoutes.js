const express       = require('express');
const { getUserByUsername } = require('../database/userQueries');
const { getProductsBySellerId } = require('../database/product');
const { getSellerByUsername } = require('../database/userQueries'); //

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

userRoutes.get(':username', async (req, res) => {
    const username = req.params.username;
  
    try {
      const sellerData = await getSellerByUsername(username);
      if (sellerData) {
        res.json(sellerData); 
      } else {
        res.status(404).send('Seller not found'); 
      }
    } catch (error) {
      console.error(`Error getting seller: ${error}`);
      res.status(500).send('Internal Server Error'); 
    }
  });

module.exports = { userRoutes }