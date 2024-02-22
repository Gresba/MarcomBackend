const express       = require('express');
const { generateId } = require('../utils/generateId');
const { dbConnection } = require('../database/connection');

const productRoutes    = express.Router()

productRoutes.get("/", async (req, res) => {
    res.send("Products")
})

module.exports = { productRoutes }