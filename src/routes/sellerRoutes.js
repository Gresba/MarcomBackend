const express       = require('express');

const userRoutes    = express.Router()

userRoutes.get("/", async (req, res) => {
    res.send("User")
})

module.exports = { userRoutes }