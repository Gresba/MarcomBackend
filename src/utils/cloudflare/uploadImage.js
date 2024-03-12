const axios = require("axios")
const fs    = require('fs')
const FormData = require('form-data');

async function uploadImageToCloudFlare(path)
{
    const form = new FormData();
    form.append('file', fs.readFileSync(path), path);

    const API_KEY = process.env.CLOUDFLARE_API_KEY
    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID

    const response = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
        form,
        {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${API_KEY}`
            }
        }
    );
    return response;
}

module.exports = {
    uploadImageToCloudFlare
}