# CouchDB (Data Storage)

This component serves as the NoSQL database backend, storing all application data across various dedicated databases within a single instance.

---

## Role and Architecture

The CouchDB instance is the centralized, persistent storage layer for the entire microservices architecture.

- **Database Type**: NoSQL document store, providing flexibility and high availability.
- **Single Instance, Multiple Databases**: A single running instance hosts several distinct databases, segregating data by service responsibility:
  - **users**: Stores user account data and credentials.
  - **products**: Stores the complete product catalog.
  - **carts**: Stores user shopping carts.
  - **logs**: Stores application and user action logs.

---

## Technical Details

| Technology      | Version / Details |
|-----------------|-------------------|
| Database Engine | CouchDB latest    |
| Port            | Standard: 5984    |

---

## Deployment and Configuration

### Container Launch

This command runs the CouchDB instance in detached mode, names it `users-db` for network access, and maps the standard CouchDB port (5984) to host port 3002.

```bash
docker run -d \
  --name users-db \
  --network scapp-net \
  -p 3002:5984 \
  mikael52/kv-storage-system\:latest
```

| Parameter                | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `--name users-db`        | The name used by microservices (like Users, Products) to connect internally. |
| `-p 3002:5984`           | Maps host port 3002 to the container's internal port 5984.                  |
| `--network scapp-net`    | Connects the database to the shared application network.                   |

---

## Accessing the CouchDB Admin Interface

To access the CouchDB admin interface, enter the provided URL directly into your web browser's address bar.

### **Steps to Access:**

1. Open your web browser (Chrome, Firefox, Edge, etc.).
2. Enter the following address:
   **[http://localhost:3002/_utils](http://localhost:3002/_utils)**
3. The browser will prompt you for credentials:
   - **Username:** `admin`
<<<<<<< HEAD
   - **Password:** `admin`

=======
   - **Password:** `admin`
>>>>>>> 28eb165c8ccbed5e98b318ac350326efec0b3c4f
