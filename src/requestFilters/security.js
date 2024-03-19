const jwt           = require('jsonwebtoken');

const { JWT_SECRET, ROLES } = require('../constants/config');
const { getInvoiceKey } = require('../database/invoiceQueries');

/**
 * Filter to be used for routes that should only be accessible to users
 * 
 * @param {*} req HTTP Request
 * @param {*} res HTTP Response
 * @param {*} next The next filter in the chain
 */
function jwtSellerAuthorization(req, res, next)
{
    // Pull the authorization header from the request
    const token = req.headers.authorization;

    // Check if the header exist
    if(token)
    {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {

            // If any errors return 401 (Unauthorized)
            if(err)
            {
                return res.status(401).send("Invaid JWT Token")
            }

            // If the role associated with the JWT token !== the USER ROLE
            if(decoded.role !== ROLES.SELLER)
            {
                return res.status(403).send("Insufficient Permissions")
            }
            
            // Append the info to the request
            console.log("Image Up")
            req.decoded = decoded
            next();
        });
    
    // If header doesn't exist deny authorization to the route
    }else{
        return res.status(401).send("No JWT Token")
    }
}

async function jwtGetInvoiceFilter(req, res, next)
{
    // Pull the authorization header from the request
    const token = req.headers.authorization;

    // Check if the header exist
    if(token)
    {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {

            // If any errors return 401 (Unauthorized)
            if(err)
            {
                return res.status(401).send("Invaid JWT Token")
            }

            // If the role associated with the JWT token !== the USER ROLE
            if(decoded.role !== ROLES.SELLER)
            {
                return res.status(403).send("Insufficient")
            }
            
            // Append the info to the request
            req.authorized = true;
            req.decoded = decoded
            next();
        });
    
    // If header doesn't exist deny authorization to the route
    }else{
        const invoiceString = req.params.invoiceId;
        const invoiceId = invoiceString.split("-")[0]
        const key = invoiceString.split("-")[1]

        console.log(invoiceId)
        console.log(key)

        const invoiceKey = await getInvoiceKey(invoiceId)
        if(key === invoiceKey)
        {
            req.authorized = true;
            console.log("true")
            next();
        }else{
            return res.status(403).send("Insufficient Permissions")
        }
    }
}

async function jwtPostFeedbackFilter(req, res, next)
{
    // Pull the authorization header from the request
    const token = req.headers.authorization;

    // Check if the header exist
    if(token)
    {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {

            // If any errors return 401 (Unauthorized)
            if(err)
            {
                return res.status(401).send("Invaid JWT Token")
            }

            // If the role associated with the JWT token !== the USER ROLE
            if(decoded.role !== ROLES.SELLER)
            {
                return res.status(403).send("Insufficient")
            }
            
            // Append the info to the request
            req.authorized = true;
            req.decoded = decoded
            next();
        });
    
    // If header doesn't exist deny authorization to the route
    }else{
        const invoiceString = req.body.InvoiceId;
        const invoiceId = invoiceString.split("-")[0]
        const key = invoiceString.split("-")[1]

        console.log(invoiceId)
        console.log(key)

        const invoiceKey = await getInvoiceKey(invoiceId)
        if(key === invoiceKey)
        {
            req.InvoiceId = invoiceId
            req.authorized = true;
            console.log("true")
            next();
        }else{
            return res.status(403).send("Insufficient Permissions")
        }
    }
}


module.exports = {
    jwtSellerAuthorization,
    jwtGetInvoiceFilter,
    jwtPostFeedbackFilter
}