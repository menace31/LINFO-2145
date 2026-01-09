# API Gateway
The **API Gateway** serves as the single entry point and facade for the entire microservices architecture of the SCAPP application. It is responsible for routing all frontend requests to the appropriate microservices (`users-daemon`, `products-daemon`, `cart-daemon`, `etc.`) and centralizes traffic management.



## 1. Role

The API Gateway is the interface between the **Frontend** and the **Microservices**.

* **Unique Access Point:** The client only needs to know a single URL to interact with the entire system.
* **Routing:** It examines the requested route and forwards the request to the correct internal microservice.
* **Error Management:** Centralization of HTTP error handling.

> **Note:** The services (Users, Products, Cart) call the **Logging Service** directly and not via the API Gateway. Therefore, there are no `/log` routes here.

## 2. Limitations

1. **No Authentication Validation**
   The API Gateway does not validate JWT tokens; it only forwards requests. This increases security risks, as unauthorized requests can reach backend services.

2. **No Caching Mechanism**
   Every request is directly forwarded to backend services, leading to redundant processing and reduced performance for repeated queries.

3. **No Rate Limiting**
   The system lacks protection against abuse (e.g., DDoS attacks or excessive requests), which could overload services and degrade performance.

4. **Direct Logging to Logging-Daemon**
   Services log directly to the logging-daemon (bypassing the API Gateway) to avoid infinite loops. This complicates end-to-end request tracing and log correlation.


## 3. Technical Stack

The project is built with the Node.js stack:

| Technology | Version / Details | Primary Role |
| :--- | :--- | :--- |
| **Runtime** | Node.js **20** (Alpine) | Execution environment. |
| **Web Framework** | Express.js **4.18.2** | Route and middleware manager. |
| **HTTP Client** | Axios **1.4.0** | Performs inter-service calls (to Products, Cart, Users). |
| **Logging** | Morgan | HTTP request logging. |
| **Debugging** | Debug | Support for debugging messages. |

## 4. Environment Variables

Here all environnement varialbes used for the service

| Variable                  | Description                          | Default Value                     |
|---------------------------|--------------------------------------|-----------------------------------|
| `USERS_SERVICE_URL`       | URL of the users service             | `http://localhost:3000`           |
| `PRODUCTS_SERVICE_URL`    | URL of the products service          | `http://localhost:3004`           |
| `CART_SERVICE_URL`        | URL of the cart service              | `http://localhost:3005`           |


## 5. Quick Start

### A. Container Build

Ensure you are in the correct source directory before running the command (you can run it directly in this directory).

```bash
cd src/back-end/api-gateway
docker build -t mikael52/scapp-api-gateway:latest .
```

### B. Container Launch
This command launches the container in detached mode, on the shared scapp-net network, and maps host port 3001 to container port 80.

Crucial: Environment variables (*_SERVICE_URL) must point to the internal service names on your Docker network (e.g., users-daemon).

```bash
docker run -d \
  --name api-gateway \
  --network scapp-net \
  -p 3001:80 \
  -e USERS_SERVICE_URL=http://users-daemon:80 \
  -e PRODUCTS_SERVICE_URL=http://products-daemon:80 \
  -e CART_SERVICE_URL=http://cart-daemon:80 \
  mikael52/scapp-api-gateway:latest
```

#### Parameter Explanations
| Parameter | Description |
|-----------|-------------|
| `-d` | Runs the container in detached mode (in the background). |
| `--name api-gateway` | Assigns a name to the container for easier management. |
| `--network scapp-net` | Connects the container to the custom Docker network (`scapp-net`) for inter-service communication. |
| `-p 3001:80` | Maps port **3001** on the host to port **80** in the container, exposing the service. |
| `-e USERS_SERVICE_URL=...` | Configures the URL of the users service used for routing requests internally. |
| `-e PRODUCTS_SERVICE_URL=...` | Configures the URL of the products service used for routing requests internally. |
| `-e CART_SERVICE_URL=...` | Configures the URL of the cart service used for routing requests internally. |

## 6. API Reference
### A. Authentication Services

Authentication APIs are accessible at http://localhost:3001/.

| Method | Route | Description | Request Body (Body) | Response (Example) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/user` | Create an example user. | `{ "username": "john", "password": "secret" }` | `{ "status": "success", "token": "..." }` |
| `GET` | `/user/:username/:password` | Log in. | *(None)* | `{ "status": "success", "token": "..." }` |
---

### B. Products Services

Products modification APIs are accessible at http://localhost:3004/.

#### I. Admin Access

| Method | Route          | Description               | Request Body (Body)                                      | Response (Example)                          |
|--------|----------------|---------------------------|----------------------------------------------------------|---------------------------------------------|
| POST   | `/product`     | Create a product.         | `{ "name": "...", "description": "...", "price": ..., "imageUrl": "...", "stock": ... }` | `{ "status": "success", "result": {...} }`  |
| PUT    | `/product/:id` | Modify a product.         | `{ "name": "...", "price": 899.99, ... }`                | `{ "status": "success", "result": {...} }`  |
| DELETE | `/product/:id` | Delete a product.         | (None)                                                   | `{ "status": "success", "result": {...} }`  |

#### II. Public Access

| Method | Route          | Description               | Response (Example)                          |
|--------|----------------|---------------------------|---------------------------------------------|
| GET    | `/products`    | List all products.        | `{ "status": "success", "products": [...] }` |
| GET    | `/product/:id` | Retrieve a single product.| `{ "status": "success", "product": {...} }`  |

### C. Cart Services

Cart modification are accessible at http://localhost:3005/.

| **Method** | **Route**                          | **Description**               | **Request Body (Body)**                                      | **Response (Example)**                          |
|------------|------------------------------------|-------------------------------|-------------------------------------------------------------|-------------------------------------------------|
| POST       | `/cart/:userId`                    | Create an empty cart          | (None)                                                      | `{ "status": "success", "result": {...} }`      |
| GET        | `/cart/:userId`                    | Retrieve the cart             | (None)                                                      | `{ "status": "success", "cart": { "userId": "...", "items": [...] } }` |
| POST       | `/cart/:userId/item`               | Add a product                 | `{ "productId": "...", "productName": "...", "price": ..., "quantity": ... }` | `{ "status": "success", "result": {...} }`      |
| PUT        | `/cart/:userId/item/:productId`    | Update product quantity       | `{ "quantity": ... }`                                         | `{ "status": "success", "result": {...} }`      |
| DELETE     | `/cart/:userId/item/:productId`    | Remove a product              | (None)                                                      | `{ "status": "success", "result": {...} }`      |
| DELETE     | `/cart/:userId`                    | Clear the cart                | (None)                                                      | `{ "status": "success", "result": {...} }`      |
