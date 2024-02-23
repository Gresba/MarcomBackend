const { dbConnection } = require('../database/connection');
const { generateId } = require('../utils/generateId');

async function getSellerBySellerId(sellerId)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM Seller
             WHERE SellerId = ?   
            `, [ sellerId ]);
        return response[0][0]
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Retrieving seller from the database")
    }
}

async function getSellerByUsername(username)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM Seller
             WHERE Username = ?   
            `, [ username ]);
        return response[0][0]
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Retrieving seller from the database")
    }
}

/**
 * Get all information about the seller based on the email provided
 * 
 * @param {*} email 
 */
async function getSellerByEmail(email)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM Seller
             WHERE Email = ?   
            `, [ email ]);
        return response[0][0]
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Retrieving seller from the database")
    }
}

/**
 * Generate a sellerId and create a seller.
 * 
 * @param {*} seller Info about the seller Email, Username, Password
 */
async function createSeller(seller)
{
    try{
        const sellerId = generateId(20);

        const response = await dbConnection.query(
            `
            INSERT INTO Seller (sellerId , Email, Username, Password) 
            VALUES (?, ?, ?, ?)`, [sellerId, seller.email, seller.username, seller.password])
        return 200;
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Inserting seller to database")
        return 500;
    }
}

async function updateSellerBySellerId(sellerId, seller)
{

}

async function deleteSellerBySellerId(sellerId)
{

}

module.exports = {
    getSellerBySellerId,
    getSellerByUsername,
    getSellerByEmail,
    createSeller,
    updateSellerBySellerId,
    deleteSellerBySellerId
}