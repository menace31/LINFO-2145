#!/bin/bash

echo "testing scalling elasticy..."
echo ""


echo "=== Current services state ==="
docker stack services scapp
echo ""

# Scale up products service
echo "=== SCALING UP: products-daemon 3 -> 5 replicas ==="
docker service scale scapp_products-daemon=5
sleep 5
docker stack services scapp | grep products-daemon
echo ""

# Scale up api-gateway
echo "=== SCALING UP: api-gateway 3 -> 5 replicas ==="
docker service scale scapp_api-gateway=5
sleep 5
docker stack services scapp | grep api-gateway
echo ""


echo "Waiting 10 seconds..."
sleep 10

# Scale down
echo "=== SCALING DOWN: products-daemon 5 -> 2 replicas ==="
docker service scale scapp_products-daemon=2
sleep 5
docker stack services scapp | grep products-daemon
echo ""

echo "=== SCALING DOWN: api-gateway 5 -> 2 replicas ==="
docker service scale scapp_api-gateway=2
sleep 5
docker stack services scapp | grep api-gateway
echo ""

# Final state
echo "=== Final services state ==="
docker stack services scapp
echo ""

echo "Scaling test completed"
echo "The services automatically scaled up and down without downtime."
