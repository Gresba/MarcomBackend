const express       = require('express')
const cors          = require('cors');
const { config }    = require('dotenv')
config();

const router = require('./routes/routes')

const app = express()
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/', router)

// Route for registration


app.listen(port, () => 
    {
        console.log(`Running port ${port}`)
    }
)