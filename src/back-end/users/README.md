# Users Service (Authentication)

This service manages all user authentication processes for the SCAPP application, handling account creation, password verification, and JWT generation for session management.

---

## Role and Responsibilities

The **Users Service** acts as the dedicated microservice for identity management.

* **Account Management:** Handles the creation of new user accounts.
* **Authentication:** Verifies user credentials (username and password).
* **Session Management:** Generates **JSON Web Tokens (JWTs)** to maintain authenticated user sessions.

> **Note:** This service interacts directly with the **Logging Service** to record authentication events (e.g., successful login, account creation).

---

## Technical Stack

The service is built on Node.js and relies on specialized libraries for security and data persistence:

| Technology | Version / Details | Primary Role |
| :--- | :--- | :--- |
| **Runtime** | Node.js **20** (Alpine) | Server execution environment. |
| **Web Framework** | Express.js **4.15.2** | Routing and middleware management. |
| **Password Hashing** | bcryptjs **2.3.0** | Securely hashes and verifies user passwords. |
| **Token Generation** | jwt-simple **0.5.0** | Generates and encodes JWTs. |
| **Database Client** | Nano **10.1.0** | CouchDB client for data persistence. |
| **Development Tools** | Gulp + Nodemon | Automation and live reloading for development. |

---

## Deployment and Configuration

### Container Build

To build the Docker image for the Users Service, run the following command from the source directory:

```bash
cd src/back-end/users
docker build -t mikael52/scapp-auth:latest .
```

### Container Launch

The service requires several environment variables to connect to the database, define the JWT secret, and locate the logging service.

```bash
docker run -d \
  --name users-daemon \
  --network scapp-net \
  -p 8080:80 \
  -e DB_HOST=users-db \
  -e DB_NAME=users \
  -e TOKEN_SECRET=changeme \
  -e LOGGING_SERVICE_URL=http://logging-daemon:80 \
  mikael52/scapp-auth\:latest
```

#### Environment Variables

| Variable               | Description                                                                                     |
|------------------------|-------------------------------------------------------------------------------------------------|
| `-p 8080:80`           | Maps host port 8080 to the container's internal port 80.                                        |
| `DB_HOST`              | Hostname/Service name of the CouchDB instance (e.g., `users-db`).                               |
| `DB_NAME`              | The name of the database where user accounts are stored.                                       |
| `TOKEN_SECRET`         | **CRUCIAL**: The secret key used to sign JWTs. Must be changed from the default for production. |
| `LOGGING_SERVICE_URL`  | The URL of the Logging Service for event tracking.                                              |

---

## API Reference

The following endpoints are exposed by the Users Service for user creation and authentication.

| Method | Route                     | Description                                      | Request Body (Body)               | Response (Example)                          |
|--------|---------------------------|--------------------------------------------------|-----------------------------------|---------------------------------------------|
| POST   | `/user`                   | Creates a new user account.                      | `{ "username": "john", "password": "secret123" }` | `{ "status": "success", "token": "eyJ..." }` |
| GET    | `/user/:username/:password` | Authenticates an existing user and returns a token. | (None)                            | `{ "status": "success", "token": "eyJ..." }` |

### API Usage Examples

The following cURL commands demonstrate how to interact with the Users Service endpoints. Assuming the service is running locally on port 8080.

#### 1. Create a User (POST /user)
This command sends a JSON body containing the new user's credentials to the service.

```bash
curl -X POST http://localhost:8080/user \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "securepassword"}'
```

#### 2. Authenticate User (GET /user/:username/:password)
This command uses the path parameters to authenticate the user and retrieve a JWT token.

```bash
curl -X GET http://localhost:8080/user/testuser/securepassword
```