const express = require('express')
const log = require('debug')('cart-d')

const app = express.Router()
const db = require('./utils/crud-wp')
const logger = require('./utils/logger')

app.post('/cart/:userId', (req, res) => {
  var userId = req.params.userId
  log(`Creating cart for user (${userId})`)
  return db.createCart(userId)
    .then((result) => {
      logger.sendLog('cart_create', userId, { action: 'Cart created' })
      res.status(200).json({ status: 'success', result })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.get('/cart/:userId', (req, res) => {
  var userId = req.params.userId
  log(`Getting cart for user (${userId})`)
  return db.getCart(userId)
    .then((cart) => {
      logger.sendLog('cart_view', userId, { action: 'Cart viewed' })
      res.status(200).json({ status: 'success', cart })
    })
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })
    })
})

app.post('/cart/:userId/item', (req, res) => {
  var userId = req.params.userId
  var productId = req.body.productId
  var productName = req.body.productName
  var price = req.body.price
  var quantity = req.body.quantity
  log(`Adding item to cart for user (${userId})`)
  return db.addItemToCart(userId, productId, productName, price, quantity)
    .then((result) => {
      logger.sendLog('cart_add_item', userId, { action: 'Item added to cart', productId: productId, quantity: quantity })
      res.status(200).json({ status: 'success', result })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.put('/cart/:userId/item/:productId', (req, res) => {
  var userId = req.params.userId
  var productId = req.params.productId
  var quantity = req.body.quantity
  log(`Updating item quantity in cart for user (${userId})`)
  return db.updateItemQuantity(userId, productId, quantity)
    .then((result) => {
      logger.sendLog('cart_update_item', userId, { action: 'Item quantity updated', productId: productId, quantity: quantity })
      res.status(200).json({ status: 'success', result })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.delete('/cart/:userId/item/:productId', (req, res) => {
  var userId = req.params.userId
  var productId = req.params.productId
  log(`Removing item from cart for user (${userId})`)
  return db.removeItemFromCart(userId, productId)
    .then((result) => {
      logger.sendLog('cart_remove_item', userId, { action: 'Item removed from cart', productId: productId })
      res.status(200).json({ status: 'success', result })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.delete('/cart/:userId', (req, res) => {
  var userId = req.params.userId
  log(`Clearing cart for user (${userId})`)
  return db.clearCart(userId)
    .then((result) => {
      logger.sendLog('cart_clear', userId, { action: 'Cart cleared' })
      res.status(200).json({ status: 'success', result })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

module.exports = app
