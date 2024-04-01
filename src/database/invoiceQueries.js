const { dbConnection } = require("./connection")

/**
 * This file will be used to store all the functions which will create queries related to invoices
 * 
 * Author:
 * Last modified: 3/31/2024
 * To Do(s):
 */

async function getInvoicesBySellerId(sellerId)
{
    const response = await dbConnection.query(
        `SELECT * FROM Invoice
        WHERE SellerId = ?`, [sellerId]
    )
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
    getInvoicesBySellerId
}