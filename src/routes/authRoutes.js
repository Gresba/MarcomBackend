const express       = require('express');
const { generateId } = require('../utils/generateId');
const { dbConnection } = require('../database/connection');

const authRoutes    = express.Router()

authRoutes.post("/register", async (req, res) => {

    console.log("Register Request Received")
    // The body of the request
    const seller = req.body;
    
    // Try to upload the seller
    try{
        const sellerId = generateId(20);

        // The query to add a seller
        await dbConnection.query(`
            INSERT INTO Seller (sellerId , Email, Username, Password) 
            VALUES (?, ?, ?, ?)
        `, [sellerId, seller.email, seller.username, seller.password])

        res.status(200).send("Uploaded Seller")
    // If something goes wrong then sell the console
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Executing Query")
        res.status(500).send("Internal Server Error")
    }
})

authRoutes.get("/signIn", async (req, res) => {
    try{

        res.status(200).send("")
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Sign in")
        res.status(500).send("Internal Server Error")
    }
})

module.exports = { authRoutes }