const axios = require('axios')

var loggingServiceUrl = process.env.LOGGING_SERVICE_URL || 'http://localhost:3002'

function sendLog (action, userId, details) {
  var timestamp = new Date().toISOString()
  var logData = {
    action: action,
    userId: userId,
    timestamp: timestamp,
    details: details || {}
  }
  return axios.post(`${loggingServiceUrl}/log`, logData)
    .then((response) => {
      return response.data
    })
    .catch((err) => {
      console.error(`Failed to send log: ${err.message}`)
      return null
    })
}

module.exports = {
  sendLog
}
