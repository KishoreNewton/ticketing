# E-COMMERCE - MICROSERVICES

### Install all package by running 

__In terminal inside__ _auth, client, expiration,orders, payments, tickets_ __directory__ 

Run

```bash
npm install
```


### Install common package from 

>https://www.npmjs.com/package/@kntickets/common

```bash
npm install @kntickets/common
```

### React - Next.js 

The front-end is avaliable in __client__ directry

### REQUIRED

>skaffold
>docker
>Kubernetes
>Minikube ['Only Linux']

### CHANGE HOSTS AT

>./infra/k8s/ingress-srv.yaml

Change the host at __line 10__ to your localhost or domain 

__OR__

Edit host file of your OS. 

_Host file at_
>MacOs/Linux - /etc/hosts
>Windows - C:\Windows\System32\Drivers\etc\hosts

_ADD_
```host
127.0.0.1 ticketing.dev
```

When opening ticketing.dev on brower you should get Error called __Your connection is not private__ in __chrome__

![Your Connection is not private](readme/connection-is-not-private.png)

Enter

>thisisunsafe

on browser to bypass the error


### RUN SKAFFOLD

Skaffold is a command line tool that facilitates continuous development for Kubernetes-native applications. Skaffold handles the workflow for building, pushing, and deploying your application, and provides building blocks for creating CI/CD pipelines.

Run
```bash
skaffold dev
```
in root directory to run in local file