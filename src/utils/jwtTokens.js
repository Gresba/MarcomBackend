const jwt           = require('jsonwebtoken')

const { log } = require('./consoleLogger')

const { config }      = require("dotenv")
config()

function generateJwtToken(jwtBody)
{
    const secret = process.env.JWT_SECRET
    const jwtToken =  jwt.sign(jwtBody, secret, {expiresIn: '24h'})
    return jwtToken;
}

module.exports = {
    generateJwtToken
}