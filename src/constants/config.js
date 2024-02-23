const { config } = require("dotenv")
config()

const DatabaseConstants = {
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PW: process.env.DATABASE_PW,
    DATABASE_NAME: process.env.DATABASE_NAME,
}

const ROLES = {
    CUSTOMER: "ROLE_CUSTOMER",
    SELLER: "ROLE_SELLER",
    ADMIN: "ROLE_ADMIN"
}

const JWT_SECRET = process.env.JWT_SECRET

const PORT = process.env.PORT

module.exports = {
    DatabaseConstants,
    JWT_SECRET,
    PORT,
    ROLES
}