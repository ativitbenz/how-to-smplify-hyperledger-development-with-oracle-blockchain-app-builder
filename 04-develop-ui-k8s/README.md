# Developing and Running Demo Frontends 

- [Developing and Running Demo Frontends](#developing-and-running-demo-frontends)
  - [Prerequisites](#prerequisites)
  - [Run Frontends Locally](#run-frontends-locally)
  - [Verify chaincode behaviour on the portal](#verify-chaincode-behaviour-on-the-portal)
  - [Build Docker Image (Optionally)](#build-docker-image-optionally)
  - [Deploy to Kubernetes (Optionally)](#deploy-to-kubernetes-optionally)

## Prerequisites
We will test the UI on the localhost. For that reason, you will need to run Google Chrome or any other browser with disabled CORS. If you use macOS, you can run a new instance of chrome executing ```open -na Google\ Chrome --args --user-data-dir=/tmp/temporary-chrome-profile-dir --disable-web-security --disable-site-isolation-trials``` in terminal.

I'm using node 17 (```nvm use 17```), with OpenSSL Legacy Provider enabled: ```export NODE_OPTIONS=--openssl-legacy-provider```.

## Run Frontends Locally
Position to ```04-develop-ui-k8s/frontends/tax-authority```. Install and run Tax Authority portal by executing:
- ```npm install```
- ```npm start``` to run the Tax Authority portal on the localhost on port 3000

Position to  ```04-develop-ui-k8s/frontends/work-and-pension```. Install and run Work and Pensions Department portal by executing:
- ```npm install```
- ```npm start``` to run the Tax Authority portal on the localhost on port 3001

## Verify chaincode behaviour on the portal
Open the browser and call for [Tax Authority](http://localhost:3000/) and [Work and Pension Department](http://localhost:3000/) portals. Check the behaviour of UC1 and UC2.

## Build Docker Image (Optionally)
Before you start the process, make sure you are logged in OCIR.

Build and push Tax Authority Portal docker image:
- ```docker build -t <region>.ocir.io/<namespace>/demo/taxadministration-frontend .```
- ```docker push <region>.ocir.io/<namespace>/demo/taxadministration-frontend```

Build and push Tax Authority Portal docker image:
- ```docker build -t <region>.ocir.io/<namespace>/demo/workandpensionsdepartment-frontend .```
- ```docker push <region>.ocir.io/<namespace>/demo/workandpensionsdepartment-frontend```

## Deploy to Kubernetes (Optionally)
Now that you configured ```kubectl``` to reach your targeted Kubernetes cluster, execute the ```kubectl apply``` command to create pods:
- ```kubectl apply -f deployment.yaml```