const { ROLES } = require("../constants/config");
const { dbConnection } = require("./connection")

/**
 * This file will be used to store all the functions which will create queries related to invoices
 * 
 * Author:
 * Last modified: 3/31/2024
 * To Do(s):
 */

async function getInvoicesByUserId(userType, userId)
{
    let query;
    if(userType === ROLES.CUSTOMER)
    {
        query = `SELECT Invoice.*, Product.Title, Product.ProductImage 
                FROM Invoice 
                JOIN Product
                ON Invoice.ProductId = Product.ProductId
                WHERE Invoice.CustomerId = ?`
    }else if(userType === ROLES.SELLER){
        query = `SELECT Invoice.*, Product.Title 
                FROM Invoice 
                JOIN Product
                ON Invoice.ProductId = Product.ProductId
                WHERE Invoice.SellerId = ?`
    }

    const response = await dbConnection.query(
        query, [userId]
    )
    return response[0]
}

async function getInvoicesByEmail(email)
{
    const response = await dbConnection.query(
        `SELECT * FROM Invoice
        WHERE CustomerEmail = ? AND CustomerId IS NULL`, [email]
    )
    console.log(response)
    return response[0]
}


async function getValueByInvoiceId(value, invoiceId)
{
    const response = await dbConnection.query(
        `SELECT ${value} FROM Invoice
        WHERE InvoiceId = ?`, [invoiceId]
    )
    return response[0][0][value]
}

async function updateInvoiceByInvoiceId(field, value, invoiceId)
{
    const query = `UPDATE Invoice SET ${field} = ? WHERE InvoiceId = ?`

    const response = dbConnection.query(
        query, [value, invoiceId]
    )
    console.log(response[0])
    return response;
}

async function createInvoice(invoice)
{
    const response = dbConnection.query(
        `INSERT INTO Invoice SET ?`, [invoice]
    )
    return response;
}

async function getInvoiceKey(invoiceId)
{
    const response = await dbConnection.query(
        `SELECT InvoiceKey FROM Invoice
        WHERE InvoiceId = ?`, [invoiceId]
    )
    return response[0][0].InvoiceKey;
}

async function getInvoiceById(invoiceId)
{
    const response = await dbConnection.query(
        `SELECT * FROM Invoice
        WHERE InvoiceId = ?`, [invoiceId]
    )
    return response[0][0];
}

async function updateFeedbackById(invoiceId, feedbackId)
{
    const response = await dbConnection.query(
        `UPDATE Invoice
        SET FeedbackId = ?
        WHERE InvoiceId = ?`, [feedbackId, invoiceId]
    )
    return response
}

module.exports = {
    createInvoice,
    getInvoiceKey,
    getInvoiceById,
    getValueByInvoiceId,
    updateFeedbackById,
    updateInvoiceByInvoiceId,
    getInvoicesByUserId,
    getInvoicesByEmail
}