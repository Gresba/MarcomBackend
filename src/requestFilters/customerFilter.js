const jwt           = require('jsonwebtoken');

const { JWT_SECRET, ROLES } = require('../constants/config');

function jwtCustomerFilter(req, res, next)
{
    // Pull the authorization header from the request which is the JWT Token
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
            if(decoded.role !== ROLES.CUSTOMER)
            {
                return res.status(403).send("Insufficient Permissions")
            }
            
            // Append the info to the request
            req.decoded = decoded
            next();
        });
    
    // If header doesn't exist deny authorization to the route
    }else{
        return res.status(401).send("No JWT Token")
    }
}

module.exports = {
    jwtCustomerFilter
}