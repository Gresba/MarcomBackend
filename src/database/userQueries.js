const { dbConnection } = require('./connection');
const { generateId } = require('../utils/generateId');

/**
 * The file is to store all the functions that run creates related the users
 * 
 * Author: Paul Kim
 * Last modified: 2/26/2024
 * To Do(s):
 */

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

async function updateUserById(userId, user)
{

}

async function deleteUserById(userId)
{

}

module.exports = {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    createUser,
    updateUserById,
    deleteUserById
}