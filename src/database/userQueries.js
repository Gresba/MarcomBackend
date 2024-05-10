const { dbConnection } = require('./connection');
const { generateId } = require('../utils/generateId');

/**
 * The file is to store all the functions that run creates related the users
 * 
 * Author: Paul Kim
 * Last modified: 3/19/2024
 * To Do(s):
 */

async function getValueByUserId(value, id)
{
    const response = await dbConnection.query(
        `SELECT ${value} FROM User
        WHERE UserId = ?`, [id]
    )
    return response[0][0][value]
}

/**
 * Retrieve a user based on the user id provided
 * 
 * @param {*} userId The user id
 * @returns The user retrieved
 */
async function getUserById(userId)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM User
             WHERE UserId = ?   
            `, [ userId ]);
        
        return response[0][0]
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Retrieving user from the database")
    }
}

/**
 * Retrieve a user based on the username provided
 * 
 * @param {*} username The user's username
 * @returns The user retrieved
 */
async function getUserByUsername(username)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM User
             WHERE Username = ?   
            `, [ username ]);
        return response[0][0]
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Retrieving user from the database")
    }
}

/**
 * Retrieve a user based on the email provided
 * 
 * @param {*} email The user's email
 * @returns The user retrieved
 */
async function getUserByEmail(email)
{
    try{
        const response = await dbConnection.query(
            `SELECT * FROM User
             WHERE Email = ?   
            `, [ email ]);
        return response[0][0]
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Retrieving user from the database")
    }
}

/**
 * Generate a userId and create a user.
 * 
 * @param {*} user Info about the user Email, Username, Password
 * @return the status of if the user was successfully created
 */
async function createUser(user)
{
    try{
        const userId = generateId(20);

        const response = await dbConnection.query(
            `
            INSERT INTO User (UserId , Email, Username, Password, AccountType) 
            VALUES (?, ?, ?, ?, ?)`, [userId, user.email, user.username, user.password, user.accountType])
        return 200;
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Inserting user to database")
        return 500;
    }
}

async function getAllMerchants()
{
    const response = await dbConnection.query(
        `SELECT * FROM User
         WHERE AccountType = 'Merchant'
        `);
    return response[0]
}

async function deleteUserById(userId)
{

}

async function getSellerByUsername(username) {
    try {
      const query = `SELECT * FROM User WHERE Username =? AND AccountType = 'Merchant'`;
      const response = await dbConnection.query(query, [username]);
      return response[0]; // return the first matching row
    } catch (error) {
      console.error(`Error getting merchant by username: ${error}`);
      throw error; // rethrow the error
    }
  }

module.exports = {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    createUser,
    deleteUserById,
    getValueByUserId,
<<<<<<< HEAD
    getAllMerchants
}
=======
    getSellerByUsername
}

>>>>>>> 377bea259ca6a2efd4b170c8d357e6e0e5d39013
