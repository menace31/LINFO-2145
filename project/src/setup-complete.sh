#!/bin/bash



# Step 1: build all images
echo "STEP 1/4: Building all Docker images..."
bash build-all-images.sh
if [ $? -ne 0 ]; then
    echo "Error building images!"
    exit 1
fi
echo ""

# Step 2: push to docker hub
echo "STEP 2/4: Pushing images to Docker Hub..."
echo "Make sure you're logged in: docker login"
read -p "Press Enter to continue..."
bash push-all-images.sh
if [ $? -ne 0 ]; then
    echo "Error pushing images!"
    exit 1
fi
echo ""

# Step 3: deploy with swarm
echo "STEP 3/4: Deploying with Docker Swarm..."
bash deploy-swarm.sh
if [ $? -ne 0 ]; then
    echo "Error deploying stack!"
    exit 1
fi
echo ""


