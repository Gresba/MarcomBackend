const express       = require('express')
const cors          = require('cors');
const bodyParser    = require('body-parser');

const router = require('./routes/routes');
const { PORT } = require('./constants/config');
const { StaticConstants } = require('./constants/staticConstants');

const app = express()
const port = PORT || 4000;

// Express configuration
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Load all the routes
app.use('/', router)

app.listen(port, () => 
    {
        console.log(`Running port ${port}`)
    }
)