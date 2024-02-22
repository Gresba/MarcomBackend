const express       = require('express');

const sellerRoutes    = express.Router()

sellerRoutes.get("/", async (req, res) => {
    res.send("Seller")
})

module.exports = { sellerRoutes }