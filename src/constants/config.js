const { config } = require("dotenv")
config()

/**
 * This file to to keep all constant variables that will never change in one place
 * so it can easily be access in the code and the constants don't need to be defined repeatedly.
 * 
 * Author: Paul Kim
 * Last Modified: 3/21/2024
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
    CUSTOMER: "Customer",
    SELLER: "Merchant",
    ADMIN: "Admin"
}

// The secret for JWT encryption which is in .env
const JWT_SECRET = process.env.JWT_SECRET

// Nonce to encrypt sha256 algorithm even more
const HASH_NONCE = process.env.HASH_NONCE

const FRONT_END_URL = process.env.FRONT_END_URL

// Port number for the server which is in .env
const PORT = process.env.PORT

module.exports = {
    DatabaseConstants,
    JWT_SECRET,
    HASH_NONCE,
    FRONT_END_URL,
    PORT,
    ROLES,
}