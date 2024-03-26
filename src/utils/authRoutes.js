const express       = require('express');

const { createUser, getUserByEmail, getUserByUsername } = require('../database/userQueries');
const { log } = require('./consoleLogger');
const { generateJwtToken } = require('./jwtTokens');
const { hashString } = require('./encrypt');

const authRoutes    = express.Router()

authRoutes.post("/register", async (req, res) => {
    try{
        // The body of the request
        const user = req.body;

        const userByEmail = await getUserByEmail(user.email)
        const userByUsername = await getUserByUsername(user.username)

        if(userByEmail)
        {
            res.status(409).send("Email already exist")
            return ;
        }

        if(userByUsername)
        {
            res.status(409).send("Username already exist")
            return;
        }

        // Try to upload the user
        user.password = hashString(user.password)

        const createUserResponse = await createUser(user)
        if(createUserResponse === 200){
            res.status(createUserResponse).send("Uploaded User")
        }else if(createUserResponse === 500){
            res.status(createUserResponse).send("Internal Server Error")
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

        // Get the user from the database by email
        const user = await getUserByEmail(loginInfo.email)

        // Get if there is a registered user with that email
        if(user)
        {
            // Check password of registered user to login info password
            if(user.Password === hashString(loginInfo.password))
            {
                const jwtBody = {
                    user: user.Email,
                    username: user.Username,
                    id: user.UserId,
                    role: user.AccountType
                }

                const jwtToken = generateJwtToken(jwtBody)

                // Remove the password from the JSON since it will be shown in the front-end
                delete user.Password;

                // If passwords match then send user info and authorize
                res.status(200).json(
                    {
                        user: user,
                        jwtToken: jwtToken
                    }
                )
            }else{
                log("Incorrect Password")
                // If passwords don't match send unauthorized
                res.status(401).send("Unauthorized")
            }

        // If user doesn't exist send unauthorized
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