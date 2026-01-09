# Logging Service

## 1. Role

This service is dedicated to recording all significant actions within the application (logins, purchases, product views, etc.). It enables tracking user activity and facilitating easier debugging.

The **Logging Service** centralizes application activity.

* **Tracking:** Records important user actions and system events for **business intelligence** (BI).
* **Debugging:** Provides a historical record of events to aid in **troubleshooting** and identifying issues.
* **Decoupled:** Unlike the API Gateway, this service is called **directly** by other microservices (Users, Products, Cart) whenever a critical event occurs.

## 2. Limitation

1. **No Log Filtering**
   All logs are stored, including low-priority or redundant entries.
   **Example:** Debug logs from development environments are mixed with production logs.

2. **No Log Rotation**
   Logs accumulate indefinitely without automatic cleanup.
   **Risk:** Database storage may fill up over time, impacting performance.

3. **No Advanced Indexing**
   Finding specific logs requires manually scanning the entire dataset.
   **Example:** Searching for errors from a specific user or timestamp is inefficient.

4. **No Encryption**
   Logs are stored in plaintext in CouchDB.
   **Security Risk:** Sensitive data (e.g., user IDs, request details) is exposed if the database is compromised.

5. **Missing API Gateway Logs**
   The API Gateway does not log to this service (to avoid loops), creating gaps in request tracing.
   **Impact:** End-to-end debugging is difficult without a complete log trail.

## 3. Technical Stack

The service relies on Node.js for execution and CouchDB for persistent, time-series data storage.

| Technology | Version / Details | Primary Role |
| :--- | :--- | :--- |
| **Runtime** | Node.js **20** (Alpine) | Server execution environment. |
| **Web Framework** | Express.js **4.15.2** | Handles the simple `/log` API endpoint. |
| **Database Client** | Nano **10.1.0** | CouchDB client for data storage. |
| **Date Management** | Moment **2.15.2** | Facilitates consistent handling and formatting of timestamps. |
| **HTTP Client** | Axios **1.4.0** | Used to call other services if required (e.g., health checks). |

---

## 4. Deployment and Configuration

### A. Container Build

To build the Docker image for the Logging Service, run the following command from the source directory:

```bash
cd src/back-end/logging
docker build -t mikael52/scapp-logging:latest .
```

### B. Container Launch

This command runs the container, maps it to host port 3003, and specifies the CouchDB connection details.

```bash
docker run -d \
  --name logging-daemon \
  --network scapp-net \
  -p 3003:80 \
  -e DB_HOST=users-db \
  -e DB_NAME=logs \
  mikael52/scapp-logging\:latest
```

#### Parameter Explanations
| Parameter | Description |
|-----------|-------------|
| `-d` | Runs the container in detached mode (in the background). |
| `--name logging-daemon` | Assigns a name to the container for easier management. |
| `--network scapp-net` | Connects the container to the custom Docker network (`scapp-net`) for inter-service communication. |
| `-p 3003:80` | Maps port **3003** on the host to port **80** in the container, exposing the service. |
| `-e DB_HOST=users-db` | Sets the CouchDB host (resolved via Docker's internal DNS). |
| `-e DB_NAME=logs` | Specifies the CouchDB database name for storing logs. |

## 5. Environment Variables

| Variable    | Description                                                                                     |
|-------------|-------------------------------------------------------------------------------------------------|
| `-p 3003:80`| Maps host port 3003 to the container's internal port 80.                                        |
| `DB_HOST`   | Hostname/Service name of the CouchDB instance (e.g., `users-db`).                               |
| `DB_NAME`   | The name of the database where log entries are stored (e.g., `logs`).                           |

---

## 6. API Reference

The Logging Service exposes simple endpoints primarily for recording and retrieving log entries.

| Method | Route      | Description                          | Request Body (Body)                                      | Response (Example)                          |
|--------|------------|--------------------------------------|----------------------------------------------------------|---------------------------------------------|
| POST   | `/log`     | Creates a new log entry.             | `{ "action": "user_login", "userId": "john", "timestamp": "...", "details": {...} }` | `{ "status": "success", "result": {...} }`  |
| GET    | `/logs`    | Retrieves all log entries.           | (None)                                                   | `{ "status": "success", "logs": [...] }`    |
| GET    | `/log/:id` | Retrieves a specific log entry by its ID. | (None)                                                   | `{ "status": "success", "log": {...} }`     |

## 7. Types de logs enregistrés

To ensure full traceability of actions within the application, each microservice records key events as structured logs. These logs help track user activity, diagnose errors, and analyze system behavior

### Users Service
The Users Service logs account-related actions (registrations, logins, failures).
- `user_register`: Account creation
- `user_register_failed`: Failed account creation
- `user_login`: Successful login
- `user_login_failed`: Failed login attempt

### Products Service
The Products Service tracks catalog interactions (product listings, views, updates).
- `products_list`: Retrieval of all products
- `product_view`: Product viewing
- `product_create`: Product creation (admin)
- `product_update`: Product modification (admin)
- `product_delete`: Product deletion (admin)

### Cart Service
The Cart Service monitors cart operations (item additions, removals, quantity updates).
- `cart_create`: Cart creation
- `cart_view`: Cart viewing
- `cart_add_item`: Product addition to cart
- `cart_update_item`: Quantity modification
- `cart_remove_item`: Product removal from cart
- `cart_clear`: Cart clearing


## 8. API Usage Examples

The following cURL commands demonstrate how to interact with the Logging Service endpoints. Assuming the service is running locally on port 3003.

### A. Create a Log Entry (POST `/log`)

- **request**
```bash
curl -X POST http://localhost:3003/log \
     -H "Content-Type: application/json" \
     -d '{
           "action": "product_view",
           "userId": "john",
           "productId": "p101",
           "timestamp": "2025-11-19T15:00:00Z",
           "details": {
             "source": "homepage_banner"
           }
         }'
```
- **answere** :
```json
 `{ "status": "success", "result": {...} }`
```

### B. Retrieve All Logs (GET `/logs`)

This command retrieves the entire list of recorded log entries from the database.

- **request**
```bash
curl -X GET http://localhost:3003/logs
```
- answere :
```json
{
  "status": "success",
  "logs": [
    {
      "_id": "log_1700123456789_abc123",
      "action": "user_login",
      "userId": "john",
      "timestamp": "2025-11-19T10:30:00+00:00",
      "details": {...}
    },
  ]
}
```