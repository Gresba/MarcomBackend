const { config } = require("dotenv")
config()

/**
 * This file to to keep all constant variables that will never change in one place
 * so it can easily be access in the code and the constants don't need to be defined repeatedly.
 * 
 * Author: Paul Kim
 * Last Modified: 2/26/2024
 * To DO:
 */

// Connection strings for the database which is in .env
const DatabaseConstants = {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PW: process.env.DATABASE_PW,
    DATABASE_NAME: process.env.DATABASE_NAME,
}

// Roles of the users which will be used to access different routes
const ROLES = {
    CUSTOMER: "ROLE_CUSTOMER",
    SELLER: "ROLE_SELLER",
    ADMIN: "ROLE_ADMIN"
}

// The secret for JWT encryption which is in .env
const JWT_SECRET = process.env.JWT_SECRET

// Port number for the server which is in .env
const PORT = process.env.PORT

module.exports = {
    DatabaseConstants,
    JWT_SECRET,
    PORT,
    ROLES
}