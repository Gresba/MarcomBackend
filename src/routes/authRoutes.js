const express       = require('express');
const { generateId } = require('../utils/generateId');
const { dbConnection } = require('../database/connection');
const { createSeller } = require('../database/sellerQueries');

const authRoutes    = express.Router()

authRoutes.post("/register", async (req, res) => {
    try{
        // The body of the request
        const seller = req.body;
        
        // Try to upload the seller
        const createSellerResponse = await createSeller(seller)
        if(createSellerResponse === 200){
            res.status(createSellerResponse).send("Uploaded Seller")
        }else if(createSellerResponse === 500){
            res.status(createSellerResponse).send("Internal Server Error")
        }
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Register Route")
        res.status(500).send("Internal Server Error");
    }
})

authRoutes.get("/signIn", async (req, res) => {
    try{
        const signInInfo = res.body;

        const seller = await dbConnection.query(
            `
                SELECT * FROM Seller
                WHERE SellerId = ?
            `, [email]
        )

        console.log(seller)

        const email = signInInfo.email;
        const password = signInInfo.email;

        res.status(200).send("")
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Sign in")
        res.status(500).send("Internal Server Error")
    }
})

module.exports = { authRoutes }