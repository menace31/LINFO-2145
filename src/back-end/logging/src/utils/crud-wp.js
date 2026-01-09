const moment = require('moment')

var logs = require('nano')(process.env.DB_URL)

function createLog (action, userId, timestamp, details) {
  return new Promise((resolve, reject) => {
    var logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    var logEntry = {
      action: action,

      userId: userId,
      timestamp: timestamp || moment().format(),
      details: details || {}
    }
    logs.insert(
      logEntry,
      logId,
      
      (error, success) => {
        if (success) {
          resolve(success)
        } else {

          reject(
            new Error(`In the creation of log entry. Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}

function getLog (logId) {
  return new Promise((resolve, reject) => {
    logs.get(logId, (error, success) => {
      if (success) {
        resolve(success)
      } else {
        reject(new Error(`To fetch log (${logId}). Reason: ${error.reason}.`))
      }
    })
  })
}

function getAllLogs () {
  return new Promise((resolve, reject) => {
    logs.list({ include_docs: true }, (error, success) => {
      
      if (success) {
        var logEntries = success.rows.map((row) => row.doc)
        resolve(logEntries)
      } else {
        reject(new Error(`To fetch all logs. Reason: ${error.reason}.`))
      }
    })
  })
}

module.exports = {
  createLog,
  getLog,
  getAllLogs
}
