const express = require('express')
const axios = require('axios')
const log = require('debug')('api-gateway-d')

const app = express.Router()

var usersServiceUrl = process.env.USERS_SERVICE_URL || 'http://localhost:3000'
var productsServiceUrl = process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3004'
var cartServiceUrl = process.env.CART_SERVICE_URL || 'http://localhost:3005'

app.post('/user', (req, res) => {
  var usr = req.body.username
  var usrPassw = req.body.password
  log(`Creating a new user (${usr})`)
  return axios.post(`${usersServiceUrl}/user`, {
    username: usr,
    password: usrPassw
  })
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.get('/user/:username/:password', (req, res) => {
  var usr = req.params.username
  var passw = req.params.password
  log(`Getting user (${usr})`)
  return axios.get(`${usersServiceUrl}/user/${usr}/${passw}`)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.get('/products', (req, res) => {
  return axios.get(`${productsServiceUrl}/products`)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.get('/product/:id', (req, res) => {
  var productId = req.params.id
  return axios.get(`${productsServiceUrl}/product/${productId}`)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.post('/product', (req, res) => {
  var name = req.body.name
  var description = req.body.description
  var price = req.body.price
  var imageUrl = req.body.imageUrl
  var stock = req.body.stock
  var category = req.body.category
  return axios.post(`${productsServiceUrl}/product`, {
    name: name,
    description: description,
    price: price,
    imageUrl: imageUrl,
    stock: stock,
    category: category
  })
    .then((response) => {
      res.status(200).json(response.data)
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
  return axios.put(`${productsServiceUrl}/product/${productId}`, {
    name: name,
    description: description,
    price: price,
    imageUrl: imageUrl,
    stock: stock,
    category: category
  })
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.delete('/product/:id', (req, res) => {
  var productId = req.params.id
  return axios.delete(`${productsServiceUrl}/product/${productId}`)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.post('/cart/:userId', (req, res) => {
  var userId = req.params.userId
  return axios.post(`${cartServiceUrl}/cart/${userId}`)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.get('/cart/:userId', (req, res) => {
  var userId = req.params.userId
  return axios.get(`${cartServiceUrl}/cart/${userId}`)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.post('/cart/:userId/item', (req, res) => {
  var userId = req.params.userId
  var productId = req.body.productId
  var productName = req.body.productName
  var price = req.body.price
  var quantity = req.body.quantity
  return axios.post(`${cartServiceUrl}/cart/${userId}/item`, {
    productId: productId,
    productName: productName,
    price: price,
    quantity: quantity
  })
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.put('/cart/:userId/item/:productId', (req, res) => {
  var userId = req.params.userId
  var productId = req.params.productId
  var quantity = req.body.quantity
  return axios.put(`${cartServiceUrl}/cart/${userId}/item/${productId}`, {
    quantity: quantity
  })
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.delete('/cart/:userId/item/:productId', (req, res) => {
  var userId = req.params.userId
  var productId = req.params.productId
  return axios.delete(`${cartServiceUrl}/cart/${userId}/item/${productId}`)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

app.delete('/cart/:userId', (req, res) => {
  var userId = req.params.userId
  return axios.delete(`${cartServiceUrl}/cart/${userId}`)
    .then((response) => {
      res.status(200).json(response.data)
    })
    .catch((err) => {
      res.status(500).json({ status: 'error', message: String(err) })
    })
})

module.exports = app
