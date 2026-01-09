const express = require('express')
const log = require('debug')('products-d')

const app = express.Router()
const db = require('./utils/crud-wp')
const logger = require('./utils/logger')

app.get('/products', (req, res) => {
  log(`Getting all products`)
  return db.getAllProducts()
    .then((products) => {
      logger.sendLog('products_list', 'system', { action: 'Retrieved all products', count: products.length })
      res.status(200).json({ status: 'success', products })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.get('/product/:id', (req, res) => {
  var productId = req.params.id
  log(`Getting product (${productId})`)
  
  return db.getProduct(productId)
    .then((product) => {
      logger.sendLog('product_view', 'system', { action: 'Product viewed', productId: productId })
      res.status(200).json({ status: 'success', product })
    })
    .catch((err) => {
      res.status(404).json({ status: 'error', message: String(err) })
    })
})

app.post('/product', (req, res) => {
  var name = req.body.name
  var description = req.body.description
  var price = req.body.price
  var imageUrl = req.body.imageUrl
  var stock = req.body.stock
  var category = req.body.category
  log(`Creating a new product (${name})`)

  return db.createProduct(name, description, price, imageUrl, stock, category)
    .then((result) => {
      logger.sendLog('product_create', 'admin', { action: 'Product created', productName: name })
      res.status(200).json({ status: 'success', result })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.put('/product/:id', (req, res) => {
  var productId = req.params.id
  var name = req.body.name
  var description = req.body.description
  var price = req.body.price
  var imageUrl = req.body.imageUrl
  var stock = req.body.stock
  var category = req.body.category

  log(`Updating product (${productId})`)
  return db.updateProduct(productId, name, description, price, imageUrl, stock, category)
    .then((result) => {
      logger.sendLog('product_update', 'admin', { action: 'Product updated', productId: productId })
      res.status(200).json({ status: 'success', result })
    })

    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.delete('/product/:id', (req, res) => {
  var productId = req.params.id
  log(`Deleting product (${productId})`)
  return db.deleteProduct(productId)
    .then((result) => {

      logger.sendLog('product_delete', 'admin', { action: 'Product deleted', productId: productId })
      res.status(200).json({ status: 'success', result })
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

module.exports = app
