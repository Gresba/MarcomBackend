const crypto = require('crypto');
const { HASH_NONCE } = require('../constants/config');

/**
 * Will use sha256 to encrypt a string with nonce.
 * 
 * @param {*} string The string that needs to be hashed
 */
function hashString(string)
{
    const hash = crypto.createHash('sha256');
    const hashedPassword = hash.update(`${string}${HASH_NONCE}`).digest('hex');

    return hashedPassword
}

module.exports = {
    hashString
}