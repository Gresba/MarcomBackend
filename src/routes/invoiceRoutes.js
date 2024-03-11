/**
 * Purpose: Store all the routes for invoices
 * 
 * Author: Paul Kim
 * Last Modified: 3/10/2024
 * TO DO(s):
 * - Implement get invoice routes
 */
const express       = require('express');
const { createInvoice, getInvoiceById } = require('../database/invoiceQueries');
const { getProductById, getProductPriceByProductId } = require('../database/product');
const { generateId } = require('../utils/generateId');
const { jwtGetInvoiceFilter } = require('../requestFilters/security');
const { sendEmail } = require('../constants/emailer');

const invoiceRoutes = express.Router()

/**
 * Structure: router.<Request Type>("<Route>", <Filters>, (req: The request, res: The response) => {
 *    logic
 * })
 * 
 * Creating POST route for creating invoices. 
 * Anyone should be able to access so do not add any filters
 */
invoiceRoutes.post("/", async (req, res) => {

    // Extracting the body from the request
    const invoice = req.body;
    console.log(invoice)

    const creationDate = new Date()
    console.log(creationDate)

    const productPrice = await getProductPriceByProductId(invoice.ProductId)

    // Fill in all the values that must be generated from us
    invoice.InvoiceId = generateId(35)
    invoice.InvoiceKey = generateId(12)
    invoice.InvoiceStatus = "Not Paid"
    invoice.CreationDate = new Date()
    invoice.invoicePrice = productPrice * invoice.Quantity

    // Save the invoice into the database
    try{
        await createInvoice(invoice)
        await sendEmail(invoice.CustomerEmail, `Your order ${invoice.InvoiceId}`, "You Created and order")
        return res.status(200).json({message: "Successfully Created"})
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Error saving invoice"})
    }
})

invoiceRoutes.get("/:invoiceId", jwtGetInvoiceFilter ,async (req, res) => {
    const invoiceId = req.params.invoiceId.split("-")[0]
    try{
        const invoice = await getInvoiceById(invoiceId)
        console.log(invoice)
        return res.status(200).json(invoice)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = {
    invoiceRoutes
}