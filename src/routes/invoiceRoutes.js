/**
 * Purpose: Store all the routes for invoices
 * 
 * Author: Paul Kim
 * Last Modified: 3/10/2024
 * TO DO(s):
 * - Implement get invoice routes
 */
const express       = require('express');
const { createInvoice, getInvoiceById, getInvoicesByUserId, updateInvoiceByInvoiceId, getInvoicesByEmail } = require('../database/invoiceQueries');
const { getProductById } = require('../database/product');
const { generateId } = require('../utils/generateId');
const { jwtGetInvoiceFilter } = require('../requestFilters/security');
const { sendEmail } = require('../utils/emailer');
const { getValueByUserId } = require('../database/userQueries');
const { FRONT_END_URL, ROLES } = require('../constants/config');
const { jwtSellerAndCustomerFilter } = require('../requestFilters/invoiceFilters');

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

    const product = await getProductById(invoice.ProductId)
    const productPrice = product.Price
    const sellerId = product.SellerId;
    const storeName = await getValueByUserId("Username", sellerId);

    // Fill in all the values that must be generated from us
    const invoiceId = generateId(35)
    const invoiceKey = generateId(12)
    
    invoice.InvoiceId = invoiceId
    invoice.InvoiceKey = invoiceKey
    invoice.InvoiceStatus = "Not Paid"
    invoice.CreationDate = new Date()
    invoice.SellerId = sellerId
    invoice.invoicePrice = productPrice * invoice.Quantity

    // Save the invoice into the database
    try
    {
        await createInvoice(invoice)
        const invoiceUrl = `${FRONT_END_URL}/${storeName}/invoice/${invoiceId}-${invoiceKey}`;
        await sendEmail(invoice.CustomerEmail, `Your order ${invoice.InvoiceId}`, `Order Link: ${invoiceUrl}`)
        return res.status(200).json({message: "Successfully Created"})
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Error saving invoice"})
    }
})

/**
 * Get a specific invoice by it's id
 */
invoiceRoutes.get("/:invoiceId", jwtGetInvoiceFilter, async (req, res) => {
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

/**
 * Route to get all the invoices that belong to a user
 * 
 * Uses jwtSellerAndCustomerFilter to extract the user from the JWT Token passed from the frontend
 */
invoiceRoutes.get("/", jwtSellerAndCustomerFilter, async (req, res) => 
{
    console.log("Accessed")
    /*
     * req.decoded was created in jwtSellerAndCustomerFilter so check the code there to see how to was created
     */
    const user = req.decoded

    try{
        // UserId or SellerId
        const userId = user.id;

        let invoices = []
        const userRole = user.role;
        const userEmail = user.user;
        if(userRole === ROLES.CUSTOMER)
        {
            const invoicesByEmail = await getInvoicesByEmail(userEmail)
            for(let i = 0; i < invoicesByEmail.length; i++)
            {
                const targetInvoice = invoicesByEmail[i];
                await updateInvoiceByInvoiceId('CustomerId', userId, targetInvoice.InvoiceId)
            }
            invoices = invoicesByEmail
        }

        const invoicesByUserId = await getInvoicesByUserId(userRole, userId)
        invoices = [...invoices, ...invoicesByUserId]

        console.log(invoices)
        return res.status(200).json(invoices)
    }catch(err){
        console.log(err)
        return res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = {
    invoiceRoutes
}