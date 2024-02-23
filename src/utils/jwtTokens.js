const jwt           = require('jsonwebtoken')
const { config }      = require("dotenv")
const { log } = require('./consoleLogger')
config()

function generateJwtToken(jwtBody)
{
    const secret = process.env.JWT_SECRET
    const jwtToken =  jwt.sign(jwtBody, secret, {expiresIn: '24h'})
    log(jwtToken)
    return jwtToken;
}

module.exports = {
    generateJwtToken
}