const express   = require('express')
const cors      = require('cors');
const mysql     = require('mysql2')

const app = express()
app.use(cors());
app.use(express.json());
const port = 5000;

app.get("/", async (req, res) => {
    res.send("Success!!!!")
})

// Route for registration
app.post("/register", async (req, res) => {

    console.log("Register Request Received")
    // The body of the request
    const seller = req.body;
    console.log(req)

    // Create connection to the database
    const pool = mysql.createPool({
        host: "na03-sql.pebblehost.com",
        user: "customer_662762_markcom",
        password: "zc8Y$9MPZDf8ZaGfk2bn",
        database: "customer_662762_markcom"
    }).promise()
    
    // Try to upload the seller
    try{

        // Randomly generate a seller id
        let sellerId = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let idLength = 20;
        for(let i = 0; i < idLength; i++)
        {
            sellerId += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        // The query to add a seller
        await pool.query(`
            INSERT INTO Seller (sellerId , Email, Username, Password) 
            VALUES (?, ?, ?, ?)
        `, [sellerId, seller.email, seller.username, seller.password])

        res.status(200).send("Uploaded Seller")
    // If something goes wrong then sell the console
    }catch(err){
        console.log(err)
        console.log("[ERROR]: Executing Query")
        res.status(500).send("Internal Server Error")
    }
})

app.listen(port, () => 
    {
        console.log(`Running port ${port}`)
    }
)