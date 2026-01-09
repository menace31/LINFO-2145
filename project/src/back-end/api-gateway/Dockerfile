# this image relies on the nodejs image
FROM node:20-alpine
# set working directory
WORKDIR /usr/src/api-gateway
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl
# let NPM packages be called anywhere within the container
ENV PATH=/usr/src/api-gateway/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install
# source files of the authentication service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .

ENV DEBUG=api-gateway-d
ENV USERS_SERVICE_URL=http://users-daemon:80
ENV PRODUCTS_SERVICE_URL=http://products-daemon:80
ENV CART_SERVICE_URL=http://cart-daemon:80

# we now use an script to deploy the authentication service
CMD source boot-in-order.sh
