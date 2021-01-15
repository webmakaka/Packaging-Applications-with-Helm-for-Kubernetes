# [Philippe Collignon] Packaging Applications with Helm for Kubernetes [ENG, 30 Jul 2019]

**Original src:**  
https://github.com/phcollignon/helm

<br/>

![Application](/img/pic-m02-pic01.png?raw=true)

<br/>

![Application](/img/pic-m03-pic01.png?raw=true)

<br/>

![Application](/img/pic-m05-pic01.png?raw=true)

<br/>

## How to run apps

I am working in ubuntu 20.04.1 LTS

Docker, Minikube, Kubectl, Skaffold should be installed.

<br/>

### Docker

```
$ docker -v
Docker version 20.10.0, build 7287ab3
```

<br/>

### Minikube installation

```
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/

```

<br/>

```
$ minikube version
minikube version: v1.16.0
```

<br/>

### Kubectl installation

```
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x kubectl && sudo mv kubectl /usr/local/bin/

$ kubectl version --client --short
Client Version: v1.20.1

```

<br/>

### Run minikube

```
$ {
    minikube --profile my-profile config set memory 8192
    minikube --profile my-profile config set cpus 4

    // minikube --profile my-profile config set vm-driver virtualbox
    minikube --profile my-profile config set vm-driver docker

    minikube --profile my-profile config set kubernetes-version v1.20.2
    minikube start --profile my-profile
}
```

<br/>

    // Enable ingress
    $ minikube addons --profile my-profile enable ingress

<br/>

    $ minikube --profile my-profile ip
    172.17.0.2

<br/>

    $ sudo vi /etc/hosts

```
#---------------------------------------------------------------------
# Minikube
#---------------------------------------------------------------------
172.17.0.2 frontend.minikube.local
172.17.0.2 backend.minikube.local
```

<br/>

### Helm installation

    $ curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash

    $ kubectl config view

    $ helm version --short
    v3.5.0+g32c2223

<br/>

## 05 - Building Helm Charts

<br/>

### Release 1.0

    $ cd apps/v1/chart/
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

    $ helm history myguestbook

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

<br/>

    $ minikube stop && minikube delete && minikube start --memory 4096
    $ minikube addons enable ingress

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

<br/>

    $ helm delete --purge myguestbook
    $ helm install myguestbook guestbook --name dev --set frontend.config.guestbook_name=DEV
    $ helm install myguestbook guestbook --name test --set frontend.config.guestbook_name=TEST

<br/>

## 07 - Managing Dependencies

<br/>

![Application](/img/pic-10.png?raw=true)

<br/>

    // ChartMuseum Instalation
    $ curl -LO https://s3.amazonaws.com/chartmuseum/release/latest/bin/linux/amd64/chartmuseum && chmod +x chartmuseum && sudo mv chartmuseum /usr/local/bin/

<br/>

// https://github.com/chartmuseum/helm-push

<br/>

    $ helm plugin install https://github.com/chartmuseum/helm-push.git

<br/>

### 35 - Demo - Packaging and Publishing Charts

**lab10**

    $ minikube stop && minikube delete && minikube start --memory 4096
    $ minikube addons enable ingress

<br/>

    $ cd lab10_helm_dependencies_begin/chart
    $ mv guestbook/charts dist
    $ cd dist

    $ helm package frontend backend database
    $ helm repo index .
    $ vi index.yaml

<br/>

```
$ chartmuseum --debug --port=8080 \
    --storage="local" \
    --storage-local-rootdir="./chartstorage"
```

<br/>

    $ helm repo add local http://localhost:8080

<br/>

    $ helm push backend-1.2.2.tgz local
    $ helm push database-1.2.2.tgz local
    $ helm push frontend-1.2.0.tgz local

<br/>

    $ helm repo update
    $ helm search repo local/

<br/>

    $ curl -v http://localhost:8080/index.yaml

<br/>

    $ helm repo list
    NAME       	URL
    local	http://localhost:8080

<br/>

    $ helm search repo local
    NAME                	CHART VERSION	APP VERSION	DESCRIPTION
    stable/local  	2.10.0       	0.12.0     	Host your own Helm Chart Repository
    local/backend 	1.2.2        	1.0        	A Helm chart for Guestbook Backend 1.0
    local/database	1.2.2        	3.6        	A Helm chart for Guestbook Database Mongodb 3.6
    local/frontend	1.2.0        	2.0        	A Helm chart for Guestbook Frontend 2.0

<br/>

    // checks
    $ helm fetch local/frontend
    $ helm fetch local/backend
    $ helm fetch local/database

<br/>

    $ helm repo update

<br/>

### 38 - Demo - Managing Dependencies

**lab10_helm_dependencies_begin/chart**

    $ vi guestbook/requirements.yaml

```
dependencies:
  - name: backend
    version: ~1.2.2
    repository: http://127.0.0.1:8080/charts
  - name: frontend
    version: ^1.2.0
    repository: http://127.0.0.1:8080/charts
  - name: database
    version: ~1.2.2
    repository: http://127.0.0.1:8080/charts
```

<br/>

```
$ helm dependency update guestbook
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 3 charts
Downloading backend from repo http://127.0.0.1:8080/charts
Save error occurred:  could not find : chart backend not found in http://127.0.0.1:8080/charts
Deleting newly downloaded charts, restoring pre-update state
Error: could not find : chart backend not found in http://127.0.0.1:8080/charts
```

<br/>

    $ ls guestbook/charts

    should be 3 files here, but there is no files

<br/>

    $ cd guestbook/charts

    $ helm fetch local/frontend
    $ helm fetch local/backend
    $ helm fetch local/database

<br/>

    $ ls
    backend-1.2.2.tgz  database-1.2.2.tgz  frontend-1.2.0.tgz

<br/>

    $ cd ../../

<br/>

    $ helm dependency list guestbook
    NAME    	VERSION	REPOSITORY                  	STATUS
    backend 	~1.2.2 	http://127.0.0.1:8080/charts	ok
    frontend	^1.2.0 	http://127.0.0.1:8080/charts	ok
    database	~1.2.2 	http://127.0.0.1:8080/charts	ok

<br/>

    $ helm install myguestbook guestbook

<br/>

    $ helm list
    $ helm status myguestbook

<br/>

    $ helm delete myguestbook --purge

    // There is no file
    $ vi guestbook/requirements.lock

<br/>

    $ cd ../dist

<br/>

    $ vi frontend/Chart.yaml

upd version to version: 1.2.1

    $ helm package frontend
    $ helm push frontend-1.2.1.tgz local

    $ curl -v http://localhost:8080/index.yaml

<br/>

    $ cd ..

```
$ helm dependency build guestbook
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 3 charts
Downloading backend from repo http://127.0.0.1:8080/charts
Save error occurred:  could not find : chart backend not found in http://127.0.0.1:8080/charts
Deleting newly downloaded charts, restoring pre-update state
Error: could not find : chart backend not found in http://127.0.0.1:8080/charts

```

    $ ls guestbook/charts

```
$ helm dependency update guestbook
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "local" chart repository
Update Complete. ⎈Happy Helming!⎈
Saving 3 charts
Downloading backend from repo http://127.0.0.1:8080/charts
Save error occurred:  could not find : chart backend not found in http://127.0.0.1:8080/charts
Deleting newly downloaded charts, restoring pre-update state
Error: could not find : chart backend not found in http://127.0.0.1:8080/charts
```

    $ ls guestbook/charts

Version should be updated, but not

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
    $ helm search repo mongodb
    $ helm inspect stable/mongodb | less

<br/>

### 44 - Demo - Installing Wordpress in Kubernetes in 1 Minute

    $ helm repo add stable https://kubernetes-charts.storage.googleapis.com/

    // To remove
    // $ helm repo remove stable

    $ helm search wordpress
    $ helm install stable/wordpress

    $ helm list --short

    // get password
    $ (kubectl get secret --namespace default zeroed-greyhound-wordpress -o jsonpath="{.data.wordpress-password}" | base64 --decode)

    $ kubectl get service

http://172.17.0.2:32277/

<br/>

<br/>

# Course Study materials:

## [Helm2 + Tiller](./Helm2.md)

## [Helm3](./Helm3.md)

<br/>

## Local Helm Repository

### [Environment preparation same as here](https://github.com/webmak1/charts-repo)

<br/>

    // Do not to forget
    $ minikube addons enable ingress

<br/>

    $ mkdir /home/marley/repo

    $ chartmuseum --debug --port=8080 \
    --storage="local" \
    --storage-local-rootdir="/home/marley/repo"

    $ helm repo add local http://localhost:8080

<br/>

    $ cd lab05_helm_chart_version1/chart

    $ mv guestbook/charts dist

    $ helm package guestbook
    $ helm repo index .

    $ helm push guestbook-0.1.0.tgz local

    $ helm repo update

```
$ helm search repo local/
NAME           	CHART VERSION	APP VERSION	DESCRIPTION
local/guestbook	0.1.0        	1.0        	A Helm chart for Guestbook 1.0
```

<br/>

    // check if something not works
    // $ helm fetch local/guestbook

<br/>

    $ helm install myguestbook local/guestbook

<br/>

    $ helm list
    $ helm status myguestbook

<br/>

http://frontend.minikube.local/

<br/>

![Application](/img/pic-05.png?raw=true)

<br/>

### Remove everything

    $ helm delete myguestbook
    $ helm repo remove local

<br/>

---

<br/>

**Marley**

Any questions in english: <a href="https://jsdev.org/chat/">Telegram Chat</a>  
Любые вопросы на русском: <a href="https://jsdev.ru/chat/">Телеграм чат</a>
