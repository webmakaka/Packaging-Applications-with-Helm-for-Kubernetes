# [Philippe Collignon] Packaging Applications with Helm for Kubernetes [ENG, 30 Jul 2019]


## [Helm2 + Tiller](./Helm2.md)


# NEED TO UPDATE TO HELM3 (in progress)

<br/>

![Application](/img/pic-00.png?raw=true)


<br/>

![Application](/img/pic-01.png?raw=true)


<br/>

![Application](/img/pic-02.png?raw=true)


<br>

## 04 - Installing a Local Kubernetes Cluster with Helm

<br/>

![Application](/img/pic-03.png?raw=true)


<br/>

### Minikube installation

    $ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/

<br/>

    // kubectl
    $ curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/


<br/>

    $ minikube version
    minikube version: v1.9.2

<br/>

    $ minikube start --memory 4096

    $ minikube addons enable ingress

    $ minikube ip
    172.17.0.2

<br/>

    # vi /etc/hosts

```
#---------------------------------------------------------------------
# Minikube cluster
#---------------------------------------------------------------------

172.17.0.2 frontend.minikube.local 
172.17.0.2 backend.minikube.local
```

<br/>

    $ kubectl version --short
    Client Version: v1.18.1
    Server Version: v1.18.0

<br/>

    $ minikube status
    host: Running
    kubelet: Running
    apiserver: Running
    kubeconfig: Configured


<br/>

### Helm installation

    $ curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash

    $ kubectl config view 

    $ helm init

    $ helm version --short
    v3.1.2+gd878d4d


<br/>

### 11 - Cleaning Helm


    $ helm list
    $ helm delete <some_package> --purge
    $ helm reset

<br/>

## 05 - Building Helm Charts

<br/>

### Release 1.0

    $ cd lab05_helm_chart_version1/chart/
    $ helm install myguestbook guestbook

<br/>

    $ kubectl get pod -l app=frontend
    NAME                        READY   STATUS    RESTARTS   AGE
    frontend-5f667c694c-bdsdm   1/1     Running   0          44s

<br/>

    $ helm list --short
    myguestbook

<br/>

    $ helm status myguestbook | less 

http://frontend.minikube.local/


<br/>

![Application](/img/pic-05.png?raw=true)


change in Chart.yaml

    appVersion: "1.1"
    description: A Helm chart for Guestbook 1.1

<br/>

templates/frontend.yaml

    image: phico/frontend:1.1

<br/>

    $ helm upgrade myguestbook guestbook

<br/>

![Application](/img/pic-06.png?raw=true)

<br/>

    $ helm list

<br/>

    $ helm history insipid-toad

<br/>

    $ helm delete myguestbook --purge

<br/>

### Upgradint Release to version 2.0

    $ cd lab06_helm_chart_version2/chart
    

    // upgrade
    $ helm upgrade myguestbook guestbook

or

    // install from scratch
    $ helm install myguestbook guestbook

<br/>

    $ kubectl get pods
    NAME                        READY   STATUS    RESTARTS   AGE
    backend-5f68d76855-sdw2q    0/1     Error     1          51s
    frontend-74cc68bc89-qczj9   1/1     Running   0          51s
    mongodb-b96698956-zl459     1/1     Running   0          51s

<br/>

    $ helm list --short

<br/>

    $ helm status myguestbook

http://frontend.minikube.local/

<br/>

![Application](/img/pic-07.png?raw=true)

<br/>

## 06 - Customizing Charts with Helm Templates

<br/>

![Application](/img/pic-08.png?raw=true)

<br/>

![Application](/img/pic-09.png?raw=true)


    $ minikube stop
    $ minikube delete
    $ minikube start --memory 4096

    $ minikube addons enable ingress

<br/>

    $ helm init

<br/>

**lab7**

    $ cd lab07_helm_template_final/chart
    $ helm template guestbook | less
    $ helm install guestbook --dry-run --debug
    $ helm install myguestbook guestbook

<br/>

    $ kubectl get pods


<br/>

**lab8**

    $ cd ../../lab08_helm_template_final/chart
    $ helm install guestbook --dry-run --debug

    $ helm list --short

    $ helm upgrade myguestbook guestbook
    $ kubectl get pods

    // delete stupid pod
    $ kubectl delete pod myguestbook-backend-7ddb696b68-zbhdj

    $ kubectl get pods

<br/>

### 31 - Demo - Installing Dev and Test Releases


**lab9**

<br/>

    # vi /etc/hosts

```
#---------------------------------------------------------------------
# Minikube cluster
#---------------------------------------------------------------------

172.17.0.2 frontend.minikube.local 
172.17.0.2 backend.minikube.local
172.17.0.2 dev.frontend.minikube.local 
172.17.0.2 dev.backend.minikube.local
172.17.0.2 test.frontend.minikube.local 
172.17.0.2 test.backend.minikube.local
```

    $ helm delete --purge myguestbook
    $ helm install myguestbook guestbook --name dev --set frontend.config.guestbook_name=DEV
    $ helm install myguestbook guestbook --name test --set frontend.config.guestbook_name=TEST


<br/>

## 07 - Managing Dependencies

<br/>

![Application](/img/pic-10.png?raw=true)

<br/>

### 35 - Demo - Packaging and Publishing Charts

**lab10**

    $ mv guestbook/charts dist
    $ cd dist
    
    $ helm package frontend backedn database
    $ helm repo index .

    $ helm serve &

http://localhost:8879

    $ helm repo list

<br/>

### 38 - Demo - Managing Dependencies

    $ vi guestbook/requirements.yaml
    $ helm dependency update guestbook
    $ ls guestbook/charts
    $ helm dependency list guestbook
    $ helm install myguestbook guestbook
    $ helm list
    $ helm status myguestbook
    $ helm delete myguestbook --purge
    $ vi guestbook/requirements.lock

<br/>

    $ vi frontend/Chart.yaml

upd version
    
    $ helm package frontend

http://localhost:8879

    $ cd ..
    $ helm dependency build questbook
    $ ls guestbook/charts

    $ helm dependency update guestbook
    $ ls guestbook/charts


<br/>

### 39 - Demo - Controlling Dependencies with Conditions and Tags

    $ helm install guestbook --set backend.enabled=false --set database.enabled=false
    $ helm install guestbook --set tags.api=false

<br/>

## 08 - Using Existing Helm Charts 

<br/>

### 43 - Demo - Using a Stable MongoDB Chart

**lab11**

    $ ls guestbook/charts
    $ rm guestbook/charts/database-1.2.2.tgz
    
    $ helm repo list
    $ helm search mongodb
    $ helm inspect stable/mongodb | less


<br/>

### 44 - Demo - Installing Wordpress in Kubernetes in 1 Minute

    $ helm search wordpress
    $ helm install stable/wordpress

    $ helm list --short

    // get password
    $ (kubectl get secret --namespace default zeroed-greyhound-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)

    $ kubectl get service

http://172.17.0.2:32277/


<br/>

---

<a href="https://marley.org"><strong>Marley</strong></a>