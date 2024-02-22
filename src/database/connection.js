const mysql           = require('mysql2')
const { config }      = require('dotenv')
config()

// Create connection to the database
const dbConnection = mysql.createPool({
    host: "na03-sql.pebblehost.com",
    user: "customer_662762_markcom",
    password: "zc8Y$9MPZDf8ZaGfk2bn",
    database: "customer_662762_markcom"
}).promise()

module.exports = {
    dbConnection
}