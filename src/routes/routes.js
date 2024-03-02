const { Router }        = require('express')
const { authRoutes } = require('./authRoutes')
const { productRoutes } = require('./productRoutes')
const { invoiceRoutes } = require('./invoiceRoutes')
const { userRoutes } = require('./userRoutes')

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

module.exports = router