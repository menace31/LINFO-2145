const express = require('express')
const log = require('debug')('logging-d')

const app = express.Router()
const db = require('./utils/crud-wp')

app.post('/log', (req, res) => {
  var action = req.body.action
  var userId = req.body.userId

  var timestamp = req.body.timestamp
  var details = req.body.details
  
  
  return db.createLog(action, userId, timestamp, details)
    .then((result) => {
      res.status(200).json({ status: 'success', result })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.get('/logs', (req, res) => {
  log(`Getting all logs`)
  return db.getAllLogs()
    .then((logs) => {
      res.status(200).json({ status: 'success', logs })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.get('/log/:id', (req, res) => {
  var logId = req.params.id
  log(`Getting log (${logId})`)
  return db.getLog(logId)
    .then((logEntry) => {
      res.status(200).json({ status: 'success', log: logEntry })
    })
    
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })
    })
})

module.exports = app
