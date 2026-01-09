# Products Service

## 1. Role

This service manages the entire product catalog. It is responsible for listing, adding, modifying, and deleting products. Due to its nature, it is one of the most frequently accessed services as all users browse products.

## 2. Limitations

1. **No Pagination**
   All products are returned at once (e.g., 10,000 products in a single response), which can slow down performance.

2. **No Search or Filtering**
   Users cannot search for products by name or filter by price, limiting usability.

3. **No Product Categories**
   All products are listed in a single catalog, making navigation difficult as the catalog grows.

4. **No Real-Time Stock Management**
   Concurrent purchases of the last available product can lead to overselling and stock inconsistencies.

5. **No Azure Blob Storage for Images**
   Product images are stored as URLs only, without integration with Azure Blob Storage for scalable media management.

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

## 4. Product Structure

Each product in CouchDB follows this structure:

```json
{
  "_id": "product_<timestamp>_<random>",
  "_rev": "1-abc123...",
  "name": "iPhone 15",
  "description": "Latest Apple smartphone",
  "price": 999.99,
  "imageUrl": "https://example.com/iphone.jpg",
  "stock": 25
}
```

The _rev field is automatically managed by CouchDB and is required for updates and deletions.

## 5. Environment Variables

Here all environnement varialbes used for the service

 | Variable                  | Description                          | Default Value                     |
 |---------------------------|--------------------------------------|-----------------------------------|
 | `DB_HOST`                 | CouchDB host address                 | `localhost`                       |
 | `DB_NAME`                 | Database name                        | `products`                        |
 | `LOGGING_SERVICE_URL`     | URL of the logging service           | `http://localhost:3003`           |

## 6. Deployment and Configuration

### A. Container Build

To build the Docker image for the Products Service, execute the following command:

```bash
cd src/back-end/products
docker build -t mikael52/scapp-products\:latest .
```

### B. Container Launch

This command runs the container, mapping it to host port 3004, and configuring database and logging connections.

```bash
docker run -d \
  --name products-daemon \
  --network scapp-net \
  -p 3004:80 \
  -e DB_HOST=users-db \
  -e DB_NAME=products \
  -e LOGGING_SERVICE_URL=http://logging-daemon:80 \
  mikael52/scapp-products\:latest
```

#### Parameter Explanations
| Parameter | Description |
|-----------|-------------|
| `-d` | Runs the container in detached mode (in the background). |
| `--name products-daemon` | Assigns a name to the container for easier management. |
| `--network scapp-net` | Connects the container to the custom Docker network (`scapp-net`) for inter-service communication. |
| `-p 3004:80` | Maps port **3004** on the host to port **80** in the container, exposing the service. |
| `-e DB_HOST=users-db` | Sets the CouchDB host (resolved via Docker's internal DNS). |
| `-e DB_NAME=products` | Specifies the CouchDB database name for product data. |
| `-e LOGGING_SERVICE_URL=http://logging-daemon:80` | Configures the URL of the logging service for centralized logging. |

## 7. API Reference

| **Method** | **Route** | **Description** | **Request Body (Body)** | **Response (Success)** |
|------------|-----------|-----------------|-------------------------|------------------------|
| GET | `/products` | Récupérer tous les produits du catalogue | (None) | `{ "status": "success", "products": [...] }` |
| GET | `/product/:id` | Récupérer un produit spécifique | (None) | `{ "status": "success", "product": {...} }` |
| POST | `/product` | Créer un nouveau produit (admin) | `{ "name": "iPhone 15", "description": "...", "price": 999.99, "imageUrl": "...", "stock": 25 }` | `{ "status": "success", "result": {...} }` |
| PUT | `/product/:id` | Modifier un produit existant (admin) | `{ "name": "...", "description": "...", "price": 899.99, "imageUrl": "...", "stock": 20 }` | `{ "status": "success", "result": {...} }` |
| DELETE | `/product/:id` | Supprimer un produit (admin) | (None) | `{ "status": "success", "result": {...} }` |