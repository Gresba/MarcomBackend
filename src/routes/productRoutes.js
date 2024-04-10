const express       = require('express');
const multer        = require('multer');

const { jwtSellerAndCustomerAuthorization } = require('../requestFilters/security');
const { getUserByEmail } = require('../database/userQueries');
const { createProduct, getProductsBySellerId, deleteProductById, getProductById, updateProductById } = require('../database/product');
const { log } = require('../utils/consoleLogger');
const { uploadImageToCloudFlare } = require('../utils/cloudflare/uploadImage');
const { generateId } = require('../utils/generateId');
/**
 * Contains all the routes for products
 * 
 * Author: Paul Kim
 * Last Modified: 2/26/2024
 * Notes: jwtSellerAndCustomerAuthorization is a guard for the routes. 
 *        It will check if someone is authorized to use route.
 * To Do(s):
 */

const productRoutes    = express.Router()

const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './src/uploads/'); // Directory to store uploaded files
        },
        filename: function (req, file, cb) {
            console.log(file)
            cb(null, file.originalname);
        }
    }
)

const upload = multer({ storage: storage });

productRoutes.get("/", jwtSellerAndCustomerAuthorization, async(req, res) => {
    log("Accessing Product Route For Sellers")
    const user = req.decoded
    const userId = user.id;

    const response = await getProductsBySellerId(userId)
    return res.status(200).send(response)
})

/**
 * This route does not need to be protected since it needs to be accessed when
 * customers view a user's storefront
 */
productRoutes.get("/:productId", async (req, res) => {
    const productId = req.params.productId

    const product = await getProductById(productId)
    return res.status(200).json(product)
})


productRoutes.put("/:productId", async (req, res) => {
    const productId = req.params.productId
    const newProduct = req.body

    try{
        await updateProductById(productId, newProduct)
        return res.status(200).json({ message: "Success"})
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error"})
    }
})

productRoutes.post("/", upload.single('image'), jwtSellerAndCustomerAuthorization, async (req, res) => {
    const product = JSON.parse(req.body.product);
    const user = req.decoded;

    const uploadImageResponse = await uploadImageToCloudFlare(req.file.path)
    const imageId = uploadImageResponse.data.result.id

    product.productId = generateId(16);
    product.productImage = imageId;
    product.sellerId = user.id 
    product.stock = 0
    
    if(!product)
    {
        return res.status(400).send("Missing Values")
    }

    const response = await createProduct(product)
    if(response.affectedRows > 0)
    {
        return res.status(201).json(
            {
                message: "Created Product"
            }
        )
    }else{
        return res.status(response).json(
            {
                message: "Failed to create product"
            }
        )
    }
})

productRoutes.delete("/:productId", jwtSellerAndCustomerAuthorization, async (req, res) => {
    const productId = req.params.productId
    const user = req.decoded
    console.log(user)

    const product = await getProductById(productId)
    if(product.SellerId === user.id)
    {
        const response = await deleteProductById(productId)
        console.log(response)
        if(response[0].affectedRows > 0)
        {
            return res.status(200).json(
                {
                    rowsAffected: response[0].affectedRows,
                    message: "Product deleted"
                }
            )
        }else{
            return res.status(404).json(
                {
                    rowsAffected: response[0].affectedRows,
                    message: "Product Id not found"
                }
            )
        }
    }else{
        return res.status(403).json(
            {
                message: "Wrong owner"
            }
        )
    }
})

module.exports = { productRoutes }