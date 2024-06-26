/**
 * Purpose: Store all the routes for feedbacks
 * 
 * Author: Paul Kim
 * Last Modified: 3/19/2024
 * TO DO(s):
 */
const express           = require('express');
const { jwtPostFeedbackFilter } = require('../requestFilters/security');
const { getValueByInvoiceId, updateFeedbackById } = require('../database/invoice');
const { updateFeedbackBySellerUsername } = require(`../database/feedback`);
const { createFeedback, getFeedbackByProductId, getFeedbackByStoreName } = require('../database/feedback');
const { generateId } = require('../utils/generateId');
const { jwtCustomerFilter } = require('../requestFilters/customerFilter');

const feedbackRoutes    = express.Router()

feedbackRoutes.get("/:productId", async (req, res) => {
    const productId = req.params.productId

    try{
        const productFeedback = await getFeedbackByProductId(productId)
        console.log(productFeedback)
        return res.status(200).json(productFeedback)
    }catch(e){
        console.log(e)
        return res.status(500).json({ message: "Internal Server Error"})
    }
})

feedbackRoutes.get("/store/:storeName", async (req, res) => {
    const storeName = req.params.storeName

    try{
        const feedback = await getFeedbackByStoreName(storeName)

        return res.status(200).json(feedback)
    }catch(err){
        return res.status(500).json({message: "Internal Server Error"})
    }
})

/**
 * Structure: router.<Request Type>("<Route>", <Filters>, (req: The request, res: The response) => {
 *    logic
 * })
 * 
 * POST route for creating feedback. 
 * Anyone should be able to access so do not add any filters.
 * Must add security (This comment should be changed when security is added)
 */
feedbackRoutes.post("/", jwtCustomerFilter,async (req, res) => {
    try{
        const rating = req.body
        const invoiceId = rating.InvoiceId
        console.log(rating)
        console.log(invoiceId)
        const SellerId = await getValueByInvoiceId("SellerId", invoiceId)
        const ProductId = await getValueByInvoiceId("ProductId", invoiceId)
        const feedbackId = generateId(35);

        const dateCreated = new Date()
        rating.DateCreated = dateCreated;
        rating.FeedbackId = feedbackId;
        rating.InvoiceId = invoiceId
        rating.SellerId = SellerId
        rating.ProductId = ProductId 
        console.log(rating)

        const response = await createFeedback(rating)
        await updateFeedbackById(invoiceId, feedbackId)
        console.log(response)
        res.status(200).json({ message: "Created Feedback" })
    }catch(e){
        console.log(e)
        if(e.errno === 4025)
        {
            res.status(400).json({ message: "Bad Request"})
        }
        res.status(500).json({ message: "Interval Server Error"})
    }
})

feedbackRoutes.post("/", jwtCustomerFilter,async (req, res) => {
    try{
        const rating = req.body
        const sellerUsername = rating.SellerUsername
        console.log(rating)
        console.log(sellerUsername)
        const feedbackId = generateId(35);

        const dateCreated = new Date()
        rating.DateCreated = dateCreated;
        rating.FeedbackId = feedbackId;
        rating.SellerUsername = sellerUsername;
        console.log(rating)

        const response = await createFeedback(rating)
        await updateFeedbackBySellerUsername(sellerUsername)
        console.log(response)
        res.status(200).json({ message: "Created Feedback" })
    }catch(e){
        console.log(e)
        if(e.errno === 4025)
        {
            res.status(400).json({ message: "Bad Request"})
        }
        res.status(500).json({ message: "Interval Server Error"})
    }
})

module.exports = {
    feedbackRoutes
}