const moment = require('moment')

var carts = require('nano')(process.env.DB_URL)

function createCart (userId) {
  return new Promise((resolve, reject) => {
    var cartId = `cart_${userId}`
    var cartData = {
      userId: userId,
      items: [],
      createdAt: moment().format(),
      updatedAt: moment().format()
    }
    carts.insert(
      cartData,
      cartId,
      (error, success) => {
        if (success) {
          resolve(success)
        } else {
          reject(
            new Error(` for user (${userId}).Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}

function getCart (userId) {
  return new Promise((resolve, reject) => {
    var cartId = `cart_${userId}`
    carts.get(cartId, (error, success) => {
      if (success) {
        resolve(success)
      } else {
        reject(new Error(`To fetch cart for user (${userId}). Reason: ${error.reason}.`))
      }
    })
  })
}

function addItemToCart (userId, productId, productName, price, quantity) {
  return new Promise((resolve, reject) => {
    var cartId = `cart_${userId}`
    carts.get(cartId, (error, cart) => {
      if (error) {
        reject(new Error(`Cart for user (${userId}) not found. Reason: ${error.reason}.`))
      } else {
        var itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        var newItem = {
          itemId: itemId,
          productId: productId,
          productName: productName,
          price: price,
          quantity: quantity || 1
        }
        cart.items.push(newItem)
        cart.updatedAt = moment().format()
        carts.insert(cart, (error, success) => {
          if (success) {
            resolve(success)
          } else {
            reject(new Error(`In adding item to cart. Reason: ${error.reason}.`))
          }
        })
      }
    })
  })
}

function updateItemQuantity (userId, productId, quantity) {
  return new Promise((resolve, reject) => {
    var cartId = `cart_${userId}`
    carts.get(cartId, (error, cart) => {
      if (error) {
        reject(new Error(`Cart for user (${userId}) not found. Reason: ${error.reason}.`))
      } else {
        var itemIndex = cart.items.findIndex((item) => item.productId === productId)
        if (itemIndex === -1) {
          reject(new Error(`Item with productId (${productId}) not found in cart.`))
        } else {
          cart.items[itemIndex].quantity = quantity
          cart.updatedAt = moment().format()
          carts.insert(cart, (error, success) => {
            if (success) {
              resolve(success)
            } else {
              reject(new Error(`In updating item quantity. Reason: ${error.reason}.`))
            }
          })
        }
      }
    })
  })
}

function removeItemFromCart (userId, productId) {
  return new Promise((resolve, reject) => {
    var cartId = `cart_${userId}`
    carts.get(cartId, (error, cart) => {
      if (error) {
        reject(new Error(`Cart for user (${userId}) not found. Reason: ${error.reason}.`))
      } else {
        var itemIndex = cart.items.findIndex((item) => item.productId === productId)
        if (itemIndex === -1) {
          reject(new Error(`Item with productId (${productId}) not found in cart.`))
        } else {
          cart.items.splice(itemIndex, 1)
          cart.updatedAt = moment().format()
          carts.insert(cart, (error, success) => {
            if (success) {
              resolve(success)
            } else {
              reject(new Error(`In removing item from cart. Reason: ${error.reason}.`))
            }
          })
        }
      }
    })
  })
}

function clearCart (userId) {
  return new Promise((resolve, reject) => {
    var cartId = `cart_${userId}`
    carts.get(cartId, (error, cart) => {
      if (error) {
        reject(new Error(`Cart for user (${userId}) not found. Reason: ${error.reason}.`))
      } else {
        cart.items = []
        cart.updatedAt = moment().format()
        carts.insert(cart, (error, success) => {
          if (success) {
            resolve(success)
          } else {
            reject(new Error(`In clearing cart. Reason: ${error.reason}.`))
          }
        })
      }
    })
  })
}

module.exports = {
  createCart,
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
}
