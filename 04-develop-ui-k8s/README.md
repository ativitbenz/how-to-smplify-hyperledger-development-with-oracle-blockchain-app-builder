# Developing and Running Demo Frontends 

------
- [Developing and Running Demo Frontends](#developing-and-running-demo-frontends)
  - [Prerequisites](#prerequisites)
  - [Build Docker Image](#build-docker-image)
  - [Deploy to Kubernetes](#deploy-to-kubernetes)
  - [Verify chaincode behaviour on the portal](#verify-chaincode-behaviour-on-the-portal)

This guide implies intermediate Kubernetes knowledge of Ingress, Services, and Deployments. You need to be able to adjust the provided k8s manifests on your own to make them available over the internet.

## Prerequisites

------
You need to complete the [OCIR excercise](https://www.oracle.com/webfolder/technetwork/tutorials/obe/oci/registry/index.html), where you will create a user and test the connectivity with OCIR:

Additionally, you need to [setup local access to OKE](https://docs.oracle.com/en-us/iaas/Content/ContEng/Tasks/contengdownloadkubeconfigfile.htm#localdownload). You cannot use the ```kubectl``` command without it.

## Build Docker Image

------
Before you start the process, make sure you are logged in OCIR.

Build and push Tax Authority Portal docker image:
- ```docker build -t <region>.ocir.io/<namespace>/demo/taxadministration-frontend .```
- ```docker push <region>.ocir.io/<namespace>/demo/taxadministration-frontend```

Build and push Tax Authority Portal docker image:
- ```docker build -t <region>.ocir.io/<namespace>/demo/workandpensionsdepartment-frontend .```
- ```docker push <region>.ocir.io/<namespace>/demo/workandpensionsdepartment-frontend```

## Deploy to Kubernetes

------
Now that you configured ```kubectl``` to reach your targeted Kubernetes cluster, execute the ```kubectl apply``` command to create pods:
- ```kubectl apply -f taxadministration.yaml```
- ```kubectl apply -f workandpensionsdepartment.yaml```

## Verify chaincode behaviour on the portal

------
Locate the Ingress endpoints or Service IP address and test Tax Authority and Work and Pension Department portals. Check the behaviour of UC1 and UC2.