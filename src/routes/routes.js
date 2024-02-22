const { Router }        = require('express')
const { authRoutes } = require('./authRoutes')

const router            = Router()

router.get("/", (req, res) => {
    res.status(200).json(
        {
            status: "Success"
        }
    )
})

router.use("/auth/", authRoutes)
router.use("/products/", authRoutes)
router.use("/seller/", authRoutes)



module.exports = router