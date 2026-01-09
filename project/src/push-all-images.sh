#!/bin/bash

# push docker image 

# push user service
echo "We are pushing users service..."
docker push mikael52/scapp-auth:latest

# push api gateway 
echo "We are pushing api-gateway..."
docker push mikael52/scapp-api-gateway:latest

# push logging service 
echo "We are pushing logging..."
docker push mikael52/scapp-logging:latest

# push product service 
echo "We are pushing products..."
docker push mikael52/scapp-products:latest

# push cart service
echo "We are pushing cart..."
docker push mikael52/scapp-cart:latest

