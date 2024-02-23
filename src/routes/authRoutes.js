const express       = require('express');

const { generateId } = require('../utils/generateId');
const { dbConnection } = require('../database/connection');
const { createSeller, getSellerByEmail, getSellerByUsername } = require('../database/sellerQueries');
const { log } = require('../utils/consoleLogger');
const { generateJwtToken } = require('../utils/jwtTokens');

const authRoutes    = express.Router()

authRoutes.post("/register", async (req, res) => {
    try{
        // The body of the request
        const seller = req.body;

        const sellerByEmail = await getSellerByEmail(seller.email)
        const sellerByUsername = await getSellerByUsername(seller.username)

        if(sellerByEmail)
        {
            res.status(409).send("Email already exist")
            return ;
        }
        if(sellerByUsername)
        {
            res.status(409).send("Username already exist")
            return;
        }

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

// Route for logins /auth/login
authRoutes.post("/login", async (req, res) => {
    try{
        // Get the login info from the body
        const loginInfo = req.body;

        // Get the seller from the database by email
        const seller = await getSellerByEmail(loginInfo.email)

        // Get if there is a registered user with that email
        if(seller)
        {
            // Check password of registered user to login info password
            if(seller.Password === loginInfo.password)
            {
                const jwtBody = {
                    user: seller.Email,
                    role: "ROLE_SELLER_BASIC"
                }

                generateJwtToken(jwtBody)

                // Remove the password from the JSON since it will be shown in the front-end
                delete seller.Password;

                // If passwords match then send seller info and authorize
                res.status(200).send(seller)
            }else{
                log("Incorrect Password")
                // If passwords don't match send unauthorized
                res.status(401).send("Unauthorized")
            }

        // If seller doesn't exist send unauthorized
        }else{
            log("Email doesn't exist")
            res.status(401).send("Unauthorized")
        }
    
    // If anything goes wrong tell the front-end it's an internal server error
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Sign in")
        res.status(500).send("Internal Server Error")
    }
})

module.exports = { authRoutes }