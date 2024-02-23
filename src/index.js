const express       = require('express')
const cors          = require('cors');
const bodyParser    = require('body-parser');


const router = require('./routes/routes');
const { PORT } = require('./constants/config');

const app = express()
const port = PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/', router)

// Route for registration


app.listen(port, () => 
    {
        console.log(`Running port ${port}`)
    }
)