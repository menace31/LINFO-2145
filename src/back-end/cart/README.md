# Cart Service
## 1. Role
Manages user shopping carts. Each user has their own cart where they can add, remove products, and modify quantities.

## 2. Limitations

1. **No Stock Validation**
   Users can add items to the cart without checking real-time stock availability (e.g., adding 100 units when only 5 are in stock).

2. **No Checkout Process**
   The cart does not support payment or order finalization.

3. **No Automatic Total Calculation**
   The frontend must manually calculate the total price.

4. **Single Cart per User**
   Users are limited to one cart; features like wishlists or multiple carts are not supported.

5. **No Promotions or Discount Codes**
   The system does not handle promotional discounts or coupon codes.


## 3. Technical Stack

The project is built with the Node.js stack:

| Technology | Version / Details | Primary Role |
| :--- | :--- | :--- |
| **Runtime** | Node.js **20** (Alpine) | Execution environment. |
| **Web Framework** | Express.js **4.18.2** | Route and middleware manager. |
| **Database Client** | Nano | 10.1.0 | CouchDB client for data storage. |
| **HTTP Client** | Axios **1.4.0** | Performs inter-service calls (to Products, Cart, Users). |
| **Logging** | Morgan | HTTP request logging. |
| **Debugging** | Debug | Support for debugging messages. |

## 4. Cart Structure

Each cart in CouchDB follows this structure:

```json
{
  "_id": "john",
  "_rev": "5-abc123...",
  "userId": "john",
  "items": [
    {
      "productId": "product_123",
      "productName": "iPhone 15",
      "price": 999.99,
      "quantity": 2
    },
    {
      "productId": "product_456",
      "productName": "MacBook Pro",
      "price": 1999.99,
      "quantity": 1
    }
  ]
}
```

## 5. Environment Variables

Here all environnement varialbes used for the service

 | Variable                  | Description                          | Default Value                     |
 |---------------------------|--------------------------------------|-----------------------------------|
 | `DB_HOST`                 | CouchDB host address                 | `localhost`                       |
 | `DB_NAME`                 | Database name                        | `products`                        |
 | `LOGGING_SERVICE_URL`     | URL of the logging service           | `http://localhost:3003`           |

## 6. Deployment and Configuration
### A. Container Build

Here the command to build the Cart docker:

```bash
cd src/back-end/cart
docker build -t mikael52/scapp-cart\:latest .
```

---
### B. Container Launch

Here the command to run the Cart docker:
```bash
docker run -d \
  --name cart-daemon \
  --network scapp-net \
  -p 3005:80 \
  -e DB_HOST=users-db \
  -e DB_NAME=carts \
  -e LOGGING_SERVICE_URL=http://logging-daemon:80 \
  mikael52/scapp-cart\:latest
```

#### Parameter Explanations
   Parameter | Description |
 |-----------|-------------|
 | `-d` | Runs the container in detached mode (in the background). |
 | `--name cart-daemon` | Assigns a name to the container for easier management. |
 | `--network scapp-net` | Connects the container to the custom Docker network (`scapp-net`) for inter-service communication. |
 | `-p 3005:80` | Maps port **3005** on the host to port **80** in the container, exposing the service. |
 | `-e DB_HOST=users-db` | Sets the CouchDB host (resolved via Docker's internal DNS). |
 | `-e DB_NAME=carts` | Specifies the CouchDB database name for cart data. |
 | `-e LOGGING_SERVICE_URL=http://logging-daemon:80` | Configures the URL of the logging service for centralized logging. |
---
## 8. API Reference
| **Method** | **Route**                          | **Description**               | **Request Body (Body)**                                      | **Response (Sucess)**                          |
|------------|------------------------------------|-------------------------------|-------------------------------------------------------------|-------------------------------------------------|
| POST       | `/cart/:userId`                    | Create an empty cart          | (None)                                                      | `{ "status": "success", "result": {...} }`      |
| GET        | `/cart/:userId`                    | Retrieve the cart             | (None)                                                      | `{ "status": "success", "cart": { "userId": "...", "items": [...] } }` |
| POST       | `/cart/:userId/item`               | Add a product                 | `{ "productId": "...", "productName": "...", "price": ..., "quantity": ... }` | `{ "status": "success", "result": {...} }`      |
| PUT        | `/cart/:userId/item/:productId`    | Update product quantity       | `{ "quantity": ... }`                                         | `{ "status": "success", "result": {...} }`      |
| DELETE     | `/cart/:userId/item/:productId`    | Remove a product              | (None)                                                      | `{ "status": "success", "result": {...} }`      |
<<<<<<< HEAD
| DELETE     | `/cart/:userId`                    | Clear the cart                | (None)                                                      | `{ "status": "success", "result": {...} }`      |
=======
| DELETE     | `/cart/:userId`                    | Clear the cart                | (None)                                                      | `{ "status": "success", "result": {...} }`      |
>>>>>>> 28eb165c8ccbed5e98b318ac350326efec0b3c4f
