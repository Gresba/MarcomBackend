const { Router }        = require('express')
const { authRoutes } = require('./auth/auth')

const router            = Router()

router.get("/", (req, res) => {
    res.status(200).json(
        {
            status: "Success"
        }
    )
})

router.use("/auth/", authRoutes)



module.exports = router