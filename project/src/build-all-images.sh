#!/bin/bash

# here we build all docker image 

# users service
cd back-end/users
docker build -t mikael52/scapp-auth:latest .
cd ../..

# api-gateway 

cd back-end/api-gateway
docker build -t mikael52/scapp-api-gateway:latest .
cd ../..

# logging service

cd back-end/logging
docker build -t mikael52/scapp-logging:latest .
cd ../..

# product service

cd back-end/products
docker build -t mikael52/scapp-products:latest .
cd ../..

# cart service

cd back-end/cart
docker build -t mikael52/scapp-cart:latest .
cd ../..


