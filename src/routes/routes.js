const { Router }        = require('express')
const { authRoutes } = require('../utils/authRoutes')
const { productRoutes } = require('./productRoutes')
const { invoiceRoutes } = require('./invoiceRoutes')
const { userRoutes } = require('./userRoutes')
const { queryRoutes } = require('./queryRoutes')
const { messageRoutes } = require('./messageRoutes')
const { feedbackRoutes } = require('./feedbackRoutes')

const router            = Router()

router.get("/", (req, res) => {
    res.status(200).json(
        {
            status: "Success"
        }
    )
})

router.use("/auth", authRoutes)
router.use("/products", productRoutes)
router.use("/users", userRoutes)
router.use("/invoices", invoiceRoutes)
router.use("/queries", queryRoutes)
router.use("/messages", messageRoutes)
router.use("/feedback", feedbackRoutes)

module.exports = router