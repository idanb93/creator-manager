# creator-manager

## Requirements
- Have Docker installed on your machine.
- The following ports should be available: 3000(frontend), 8080(backend), 3306(database).

## Getting started:

```
cd creator-manager
```

Initialize the application:

```
docker compose up
```

### This step may take a few minutes, as the backend container waits for the database health check to pass while the frontend container is being built.

Open your browser and browse to http://localhost:3000 - You should be able to see the login screen.

### Example User:
```
email : bill.gates@microsoft.com
password : 1111
```

Run the application in dev mode:

```
docker-compose -f docker-compose.dev.yaml up
```

Open your browser and browse to http://localhost:3000
