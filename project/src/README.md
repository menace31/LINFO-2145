# Documentation du Projet - Shopping Cart Application

## 0. Introduction

This project consists of developing a shopping cart application while learning how to work with a microservices-based architecture. The goal is to build a complete platform where users can create an account, browse products, manage their cart, and record all important actions to better understand what happens inside the system.

The application is fully divided into independent services:

 - **authentication**

 - **product catalog**

 - **cart management**

 - **centralized logging**

 - **API Gateway**

along with a CouchDB database used as a NoSQL storage system. Each service is containerized with Docker and orchestrated using Docker Swarm to ensure scalability, fault tolerance, and distributed deployment.

Each microservice is responsible for its own domain, communicates with others over HTTP, and uses its own CouchDB database. The Logging Service centralizes all important interactions to provide better observability across the entire system.


## 1. global Architecture

The application uses a microservice-based architecture designed to be modular, easy to evolve, and highly scalable. Each feature is isolated in its own dedicated service, allowing you to deploy, update, or scale components independently without affecting the rest of the system.

The Frontend (Svelte) communicates only with the API Gateway, which acts as the single entry point. The Gateway receives all client requests, applies routing rules, handles errors, and forwards calls to the appropriate microservices:

```
Frontend (Svelte)
    |
    v
API Gateway (port 3001)
    |
    +---> Users Service (port 8080)      ---> CouchDB (users)
    |
    +---> Logging Service (port 3003)    ---> CouchDB (logs)
    |
    +---> Products Service (port 3004)   ---> CouchDB (products)
    |
    +---> Cart Service (port 3005)       ---> CouchDB (carts)
```

## 2. Start the project
### A. Prerequisites
Before starting, you need:

- a linux OS

- Docker installed

- Docker Compose or Docker Swarm

- A Docker Hub account

- An Azure account (only if you deploy to the cloud)

- Available ports: 80, 3001, 3002, 3003, 3004, 3005, 8080

### B. Installation et lancement en local

First, download the project and give execution rights to the .sh script files:

```bash
git clone <repo>
cd project/src

# Rendre les scripts exécutables
chmod +x *.sh
```

Then run the script that will start all services at once:

```bash
./setup-complete.sh
```

This script will:

- Build all Docker images

- Push them to Docker Hub (you must be logged in with docker login)

- Initialize Docker Swarm if needed

- Create the overlay network

- Deploy all services


💡 **Other way:** If you prefer to run the service manually:

**1. build all images**
```bash
 cd back-end/api-gateway && docker build -t mikael52/scapp-api-gateway:latest .
 cd ../logging && docker build -t mikael52/scapp-logging:latest .
 cd ../products && docker build -t mikael52/scapp-products:latest .
 cd ../cart && docker build -t mikael52/scapp-cart:latest .
```
**2. Push to Docker Hub**
```bash
docker login
./push-all-images.sh
```

**3. Initialize Docker Swarm**
```bash
docker swarm init
```

**4. Deploy the stack**
```bash
docker stack deploy -c scapp.yml scapp
```

**5. Check that all service run correctly**
```bash
docker stack services scapp
```
once the stack service will be executed, your terminal sould have something like this:
```
ID             NAME                    MODE         REPLICAS   IMAGE
qxnrkyb0s2pk   scapp_api-gateway       replicated   3/3        mikael52/scapp-api-gateway:latest
2nqfs2j6q544   scapp_cart-daemon       replicated   2/2        mikael52/scapp-cart:latest
cchomvv6x3u0   scapp_logging-daemon    replicated   2/2        mikael52/scapp-logging:latest
fvo8qsdvqj05   scapp_products-daemon   replicated   3/3        mikael52/scapp-products:latest
gasyofl3lljh   scapp_users-daemon      replicated   2/2        mikael52/scapp-auth:latest
bz6z6l5u
```

**6. To check if scaling working correcly :**

```bash
# Lancer le test automatique
./test-scaling.sh

# Ou manuellement
docker service scale scapp_products-daemon=5  # scale up
docker service scale scapp_products-daemon=2  # scale down
```

The number of running replicas for the scapp_products-daemon service should update accordingly.
When scaling up to 5, Docker Swarm should start additional containers.
When scaling down to 2, Swarm should stop the extra replicas automatically.

**7. To verify that scaling is working correctly**

run this command again:
```bash
docker stack services scapp
```

Then check whether the number of replicas matches the value you selected. For example:
 ```
 ID             NAME                    MODE         REPLICAS   IMAGE
gasyofl3lljh   scapp_users-daemon      replicated   5/5        mikael52/scapp-auth:latest
```

### C. Replica Configuration and Scaling Rationale

The number of replicas for each service is defined in the `scapp.yml` stack configuration file. These numbers were strategically chosen based on the expected load and function of each microservice.

| Service | Replica Count | Rationale for Scaling Decision |
| :--- | :--- | :--- |
| **users-db** | **1** | The database instance is configured to run as a single instance to prevent data synchronization issues in this specific setup. |
| **users-daemon** | **2** | **Authentication is moderately solicited.** Two replicas provide high availability without requiring excessive resources. |
| **logging-daemon** | **2** | **Receives high volume of write requests** logs from all other microservices. Two replicas ensure sufficient capacity to handle the load. |
| **products-daemon** | **3** | **This is the most solicited service.** It handles all product browsing and catalog lookups, requiring the highest number of replicas to manage peak traffic. |
| **cart-daemon** | **2** | **Moderately solicited.** It manages user sessions and cart modifications, requiring more stability than a single instance. |
| **api-gateway** | **3** | **Acts as the single entry point for all client requests.** Three replicas ensure optimal load distribution and fault tolerance at the network boundary. |

#### Load Balancing
The distribution of incoming requests across these replicas is handled automatically and transparently by **Docker Swarm's** integrated **Load Balancing** mechanism, ensuring optimal resource utilization and service continuity.



## 3. Run the project
### A. Accessing Services After Deployment

Once the **Docker Swarm** stack is successfully deployed, all services are accessible locally via the ports exposed by the API Gateway and the CouchDB service.

Here are the essential access points for the application and administration:

| Service | Role | Access URL | Credentials |
| :--- | :--- | :--- | :--- |
| **API Gateway** | The application's single entry point (for the Frontend and API testing) | `http://localhost:3001` | N/A |
| **CouchDB Admin** | Database administration interface | `http://localhost:3002/_utils` | `admin/admin` |
| **Visualizer** | Swarm status visualization | `http://localhost:80` | N/A |

#### B. Important Note
Ensure that ports **3001**, **3002**, and **80** are not already in use on your machine to guarantee that the services are properly exposed.


## 4. Azure Configuration and Deployment

TODO

## 5. Operational Commands and Troubleshooting

### A. Essential Docker Swarm Commands

These commands are essential for managing and monitoring the deployed stack (`scapp`) in the Docker Swarm environment.

| Command Objective | Command Line | Notes |
| :--- | :--- | :--- |
| **View Service Status** | `docker stack services scapp` | Checks the running state and replica count for all services in the stack. |
| **View Service Logs** | `docker service logs scapp_api-gateway` | Displays standard output logs for a specific service. |
| **View Live Logs** | `docker service logs -f scapp_products-daemon` | Uses the `-f` (follow) flag to stream live logs from a service. |
| **Scale a Service** | `docker service scale scapp_products-daemon=5` | Adjusts the number of replicas for a service (scales up or down). |
| **View Running Containers** | `docker ps` | Lists all containers currently running on the node. |
| **Remove the Stack** | `docker stack rm scapp` | Stops and removes all services and containers associated with the stack. |

---

### B. Known Issues and Solutions (Troubleshooting)

This section addresses common issues that may occur during local deployment or operation.

#### 1. Issue: The `scapp-net` network already exists
This occurs when a previous local deployment failed to clean up the overlay network properly.

* **Solution:** Manually remove the existing network before redeploying.

```bash
docker network rm scapp-net
./deploy-swarm.sh
```

#### 2. Issue: Services fail to start
This usually indicates an issue with the container image, environment variables, or dependencies.
**Solution :** Check the deployment logs for the specific failing service to identify the error message.
```bash
docker service logs scapp_<service-name>
```

#### 3. CouchDB is inaccessible (e.g., cannot connect to users-db)
This means the database container is either stopped or not connected to the correct network.
**Solution :** Verify the status of the users-db container and its connection to the overlay network.
```bash
docker ps | grep users-db
docker network inspect scapp_scapp-net
```

## 6. Justification of Technological Choices

### A. Node.js + Express.js
**Node.js** was chosen as the runtime environment because it was a project requirement. **Express.js** was selected as the web framework for the following reasons:
- **Simplicity**: Express.js is one of the most straightforward and widely used frameworks for building RESTful APIs in Node.js.
- **Lightweight**: It provides a minimalist approach, allowing for fast and efficient development.
- **Middleware Ecosystem**: A rich ecosystem of middleware is available, making it easy to extend functionality (e.g., authentication, logging, request parsing).
- **Ease of Use**: Its intuitive API and extensive documentation make it accessible for both beginners and experienced developers.

---

### B. CouchDB (NoSQL)
**CouchDB** was preferred over traditional SQL databases for several key reasons:
1. **Scalability**: CouchDB is designed for distributed environments, making horizontal scaling easier and more efficient.
2. **Schema Flexibility**: As a NoSQL database, it allows for dynamic and flexible data structures without requiring complex migrations.
3. **Native REST API**: CouchDB includes a built-in REST API, which aligns perfectly with our microservices architecture.
4. **Replication**: It supports robust replication features, including bidirectional synchronization, which is useful for data consistency across multiple instances.
5. **Course Recommendation**: While MongoDB was also a viable option, CouchDB was recommended in the course and offers unique features like built-in conflict resolution and offline-first capabilities.

---

### C. Docker Swarm
**Docker Swarm** was chosen for container orchestration due to its:
1. **Simplicity**: It is easier to set up and manage compared to Kubernetes, making it ideal for smaller projects or teams.
2. **Native Integration**: Swarm is built into Docker, eliminating the need for additional tools or complex configurations.
3. **Automatic Load Balancing**: Swarm provides built-in load balancing, ensuring even distribution of traffic across services.
4. **Effortless Scaling**: Scaling services up or down is as simple as running a single command (`docker service scale`), which streamlines deployment and resource management.

---

### D. Microservices Architecture
The application was divided into **independent microservices** to achieve:
1. **Decoupling**: Each service can be developed, tested, and deployed independently, reducing dependencies and accelerating development cycles.
2. **Targeted Scalability**: Services can be scaled individually based on demand (e.g., the `products` service runs 3 replicas to handle higher traffic).
3. **Fault Isolation**: If one service fails, others remain operational, improving overall system resilience.
4. **Technological Flexibility**: Different services can use different technologies or programming languages if needed, allowing for future-proofing and innovation.

---

### E. API Gateway Pattern
An **API Gateway** was implemented to:
1. **Enhance Security**: Centralizing requests through a single entry point simplifies security management (e.g., authentication, rate limiting, and DDoS protection).
2. **Simplify Client Interaction**: The frontend only needs to communicate with one endpoint, reducing complexity and improving maintainability.
3. **Enable Flexibility**: Backend services can evolve or change without impacting the frontend, as long as the Gateway's API contract remains stable.
4. **Centralized Monitoring**: All incoming requests can be logged, monitored, and analyzed in one place, improving observability and debugging.

---

### F. Axios for HTTP Requests
**Axios** was chosen over the native `fetch` API because it offers:
1. **Better Error Handling**: Axios provides detailed error responses, making it easier to diagnose and fix issues.
2. **Request/Response Interceptors**: Interceptors allow for pre-processing requests (e.g., adding headers) and post-processing responses (e.g., transforming data).
3. **Configurable Timeouts**: Timeouts can be set globally or per request, preventing indefinite hangs.
4. **Node.js Compatibility**: While `fetch` is primarily browser-based, Axios works seamlessly in both browser and Node.js environments.

---

### G. bcryptjs for Password Hashing
**bcryptjs** is used for password hashing because:
1. **Computational Intensity**: It is intentionally slow, making brute-force attacks more difficult.
2. **Automatic Salting**: bcryptjs automatically generates and manages salt, ensuring unique hashes for identical passwords.
3. **Industry Standard**: It is widely recognized and trusted for secure password storage, adhering to best practices.

---

### H. JSON Web Tokens (JWT)
**JWT** was adopted for authentication due to its:
1. **Statelessness**: No server-side session storage is required, reducing overhead and simplifying scaling.
2. **Decentralized Validation**: Any service in the architecture can verify a token, enabling distributed authentication.
3. **Compactness**: Tokens are lightweight and can be easily transmitted via HTTP headers, cookies, or URL parameters.
4. **Flexibility**: JWTs can include custom claims (e.g., user roles, permissions) to support fine-grained access control.



## 7. Authors
Project completed by Mikael Turkoglu and Maxime Devillet as part of the course LINFO2145 - Cloud Computing.
