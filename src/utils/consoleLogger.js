function log(message)
{
    console.log(`[LOG]: ${message}`)
}

function error(error)
{
    console.log(`[ERROR]: ${error}`)
}

module.exports = {
    log,
    error
}