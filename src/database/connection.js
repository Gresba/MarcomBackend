const mysql           = require('mysql2')
const { DatabaseConstants } = require('../constants/config')

// Create connection to the database
const dbConnection = mysql.createPool({
    host: DatabaseConstants.DATABASE_HOST,
    user: DatabaseConstants.DATABASE_USER,
    password: DatabaseConstants.DATABASE_PW,
    database: DatabaseConstants.DATABASE_NAME
}).promise()

module.exports = {
    dbConnection
}