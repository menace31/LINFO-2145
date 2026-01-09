var products = require('nano')(process.env.DB_URL)

function createProduct (name, description, price, imageUrl, stock, category) {
  return new Promise((resolve, reject) => {
    var productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    var productData = {
      name: name,
      description: description,
      price: price,
      imageUrl: imageUrl || '',
      stock: stock || 0,
      category: category || 'Other'
    }
    products.insert(
      productData,
      productId,
      (error, success) => {
        if (success) {
          resolve(success)
        } else {
          reject(
            new Error(`In the creation of product (${name}). Reason: ${error.reason}.`)
          )
        }
      }
    )
  })
}

function getProduct (productId) {
  return new Promise((resolve, reject) => {
    products.get(productId, (error, success) => {
      if (success) {
        resolve(success)
      } else {
        reject(new Error(`To fetch product (${productId}). Reason: ${error.reason}.`))
      }
    })
  })
}

function getAllProducts () {
  return new Promise((resolve, reject) => {
    products.list({ include_docs: true }, (error, success) => {
      if (success) {
        var productList = success.rows.map((row) => row.doc)
        resolve(productList)
      } else {
        reject(new Error(`To fetch all products. Reason: ${error.reason}.`))
      }
    })
  })
}

function updateProduct (productId, name, description, price, imageUrl, stock, category) {
  return new Promise((resolve, reject) => {
    products.get(productId, (error, existing) => {
      if (error) {
        reject(new Error(`Product (${productId}) not found. Reason: ${error.reason}.`))
      } else {
        var updatedProduct = {
          _id: existing._id,
          _rev: existing._rev,
          name: name || existing.name,
          description: description || existing.description,
          price: price || existing.price,
          imageUrl: imageUrl || existing.imageUrl,
          stock: stock !== undefined ? stock : existing.stock,
          category: category || existing.category || 'Other'
        }
        products.insert(updatedProduct, (error, success) => {
          if (success) {
            resolve(success)
          } else {
            reject(new Error(`In the update of product (${productId}). Reason: ${error.reason}.`))
          }
        })
      }
    })
  })
}

function deleteProduct (productId) {
  return new Promise((resolve, reject) => {
    products.get(productId, (error, existing) => {
      if (error) {
        reject(new Error(`Product (${productId}) not found. Reason: ${error.reason}.`))
      } else {
        products.destroy(existing._id, existing._rev, (error, success) => {
          if (success) {
            resolve(success)
          } else {
            reject(new Error(`In the deletion of product (${productId}). Reason: ${error.reason}.`))
          }
        })
      }
    })
  })
}

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
}
