const { generateId } = require("../utils/generateId")
const { dbConnection } = require("./connection")

/**
 * This file will be used to store all the functions which will create queries related to invoices
 * 
 * Author:
 * Last modified: 3/10/2024
 * To Do(s):
 */

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

module.exports = {
    createInvoice,
    getInvoiceKey,
    getInvoiceById
}