const mysql           = require('mysql2')
const { DatabaseConstants } = require('../constants/config')

/**
 * The file is to create a connection to the database and store it so we don't need to constantly
 * make new connects
 * 
 * Author: Paul Kim
 * Last Modified: 2/26/2024
 * To DO:
 */

// Create connection to the database
const dbConnection = mysql.createPool({
    host: DatabaseConstants.DATABASE_HOST,
    user: DatabaseConstants.DATABASE_USER,
    port: 3306,
    password: DatabaseConstants.DATABASE_PW,
    database: DatabaseConstants.DATABASE_NAME
}).promise()

module.exports = {
    dbConnection
}