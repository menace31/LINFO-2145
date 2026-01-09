#!/bin/bash

echo "Deploying Shopping Cart Application with Docker Swarm..."

# Check if swarm is initialized
if ! docker info | grep -q "Swarm: active"; then
    echo "Initializing Docker Swarm..."
    docker swarm init
fi

# Remove old local network if it exists
if docker network ls | grep -q "scapp-net"; then
    echo "Removing old scapp-net network (if local scope)..."
    docker network rm scapp-net 2>/dev/null || echo "Network in use or doesn't exist, continuing..."
fi

# Deploy the stack (network will be created automatically with overlay driver)
echo "Deploying stack..."
docker stack deploy -c scapp.yml scapp



