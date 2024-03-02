const { Router }        = require('express')
const { authRoutes } = require('./authRoutes')
const { productRoutes } = require('./productRoutes')

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
router.use("/user", authRoutes)

module.exports = router