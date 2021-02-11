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

### Skaffold installation

```
$ curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64

$ chmod +x skaffold
$ sudo mv skaffold /usr/local/bin

$ skaffold version
v1.19.0
```

<br/>

### Run minikube

```
$ {
    minikube --profile pack-apps config set memory 8192
    minikube --profile pack-apps config set cpus 4

    // minikube --profile pack-apps config set vm-driver virtualbox
    minikube --profile pack-apps config set vm-driver docker

    minikube --profile pack-apps config set kubernetes-version v1.20.2
    minikube start --profile pack-apps
}
```

<br/>

    // Enable ingress
    $ minikube addons --profile pack-apps enable ingress

<br/>

    $ minikube --profile pack-apps ip
    172.17.0.2

<br/>

    $ sudo vi /etc/hosts

```
#---------------------------------------------------------------------
# Minikube
#---------------------------------------------------------------------
192.168.49.2 frontend.minikube.local
192.168.49.2 backend.minikube.local
```

<br/>

### Helm installation

    $ curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | bash

    $ kubectl config view

    $ helm version --short
    v3.5.0+g32c2223

<br/>

### Kustomize installation

```
$ curl -s "https://raw.githubusercontent.com/\
kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash && chmod +x kustomize && sudo mv kustomize /usr/local/bin/
```

<br/>

### Run app

<br/>

    $ cd skaffold

    $ docker login

Need to update my docker image name webmakaka/\*\*\* to your in scripts from skaffold and apps/v1.1/chart folders.

    $ skaffold dev -f ./skaffold-helm.yaml

or

    $ skaffold dev -f ./skaffold-kustomize.yaml

<br/>

    $ kubectl get pods

<br/>

browser -> http://frontend.minikube.local

<br/>

## 05 - Building Helm Charts

<br/>

### First try

    $ cd apps/v1/chart/
    $ helm install myguestbook guestbook

<br/>

    $ helm list --short
    myguestbook

<br/>

```
$ helm status myguestbook
NAME: myguestbook
LAST DEPLOYED: Sat Jan 16 01:12:05 2021
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

http://frontend.minikube.local/

<br/>

![Application](/img/pic-m05-pic02.png?raw=true)

<br/>

templates/frontend.yaml

    image: phico/frontend:1.1

<br/>

    $ helm upgrade myguestbook guestbook

<br/>

    $ helm list

<br/>

    $ helm history myguestbook

<br/>

    $ helm delete myguestbook

<br/>

## 06 - Customizing Charts with Helm Templates

<br/>

![Application](/img/pic-m06-pic01.png?raw=true)

<br/>

![Application](/img/pic-m06-pic02.png?raw=true)

<br/>

![Application](/img/pic-m06-pic03.png?raw=true)

<br/>

    $ cd v2/chart

    // check
    $ helm template guestbook | less

    // check
    $ helm install guestbook --dry-run --debug

<br/>

    $ helm install myguestbook guestbook
    // $ helm upgrade myguestbook guestbook

<br/>

    $ kubectl get pods

<br/>

    // delete stupid pod
    $ kubectl delete pod myguestbook-backend-7ddb696b68-zbhdj

<br/>

```
http://frontend.minikube.local/
OK
```

<br/>

    $ helm delete myguestbook

<br/>

### Installing Dev and Test Releases

<br/>

    $ sudo vi /etc/hosts

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

    $ cd v3/chart
    $ helm install dev guestbook --set frontend.config.guestbook_name=DEV
    $ helm install test guestbook --set frontend.config.guestbook_name=TEST

<br/>

```
http://test.frontend.minikube.local/
OK!
```

<br/>

    $ cd v3/chart
    $ helm delete dev guestbook
    $ helm delete test guestbook

<br/>

## 07 - Managing Dependencies

<br/>

![Application](/img/pic-m07-pic01.png?raw=true)

<br/>

```
// ChartMuseum Instalation
$ curl -LO https://s3.amazonaws.com/chartmuseum/release/latest/bin/linux/amd64/chartmuseum && chmod +x chartmuseum && sudo mv chartmuseum /usr/local/bin/
```

<br/>

```
$ helm plugin install https://github.com/chartmuseum/helm-push.git
```

<br/>

### 35 - Demo - Packaging and Publishing Charts

<br/>

    $ cd v4/chart
    $ mv guestbook/charts dist
    $ cd dist

<br/>

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

```
$ helm search repo local/
NAME          	CHART VERSION	APP VERSION	DESCRIPTION
local/backend 	1.2.2        	1.0        	A Helm chart for Guestbook Backend 1.0
local/database	1.2.2        	3.6        	A Helm chart for Guestbook Database Mongodb 3.6
local/frontend	1.2.0        	2.0        	A Helm chart for Guestbook Frontend 2.0
```

<br/>

    $ curl -v http://localhost:8080/index.yaml

<br/>

    $ helm repo list
    NAME       	URL
    local	http://localhost:8080

<!-- <br/>

    // checks
    $ helm fetch local/frontend
    $ helm fetch local/backend
    $ helm fetch local/database -->

<br/>

    $ helm repo update

<br/>

### 38 - Demo - Managing Dependencies

<br/>

    $ vi guestbook/requirements.yaml

<br/>

```
dependencies:
  - name: backend
    version: ~1.2.2
    repository: http://127.0.0.1:8080/
  - name: frontend
    version: ^1.2.0
    repository: http://127.0.0.1:8080/
  - name: database
    version: ~1.2.2
    repository: http://127.0.0.1:8080/
```

<br/>

```
$ helm dependency update guestbook
```

<br/>

```
$ ls guestbook/charts
backend-1.2.2.tgz  database-1.2.2.tgz  frontend-1.2.0.tgz
```

<!-- <br/>

    $ cd guestbook/charts

    $ helm fetch local/frontend
    $ helm fetch local/backend
    $ helm fetch local/database -->

<br/>

```
$ helm dependency list guestbook
NAME    	VERSION	REPOSITORY            	STATUS
backend 	~1.2.2 	http://127.0.0.1:8080/	ok
frontend	^1.2.0 	http://127.0.0.1:8080/	ok
database	~1.2.2 	http://127.0.0.1:8080/	ok
```

<br/>

    $ helm install myguestbook guestbook

<br/>

```
$ helm list
NAME       	NAMESPACE	REVISION	UPDATED                                	STATUS  	CHART          	APP VERSION
myguestbook	default  	1       	2021-01-16 04:22:24.867593634 +0300 MSK	deployed	guestbook-1.2.2	2.0
```

<br/>

    $ helm status myguestbook

<br/>

```
http://frontend.minikube.local/
OK!
```

<br/>

    $ helm delete myguestbook

<br/>

    $ ls guestbook/requirements.lock

<br/>

    $ cd dist/

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

```

    $ ls guestbook/charts

```
$ helm dependency update guestbook
```

    $ ls guestbook/charts

```
$ ls guestbook/charts
backend-1.2.2.tgz  database-1.2.2.tgz  frontend-1.2.1.tgz
```

<br/>

```
$ helm dependency list guestbook
NAME    	VERSION	REPOSITORY            	STATUS
backend 	~1.2.2 	http://127.0.0.1:8080/	ok
frontend	^1.2.0 	http://127.0.0.1:8080/	ok
database	~1.2.2 	http://127.0.0.1:8080/	ok
```

<br/>

```
???
I do not know is it rigt or not
???
```

    $ cd guestbook
    $ helm package .
    $ helm push guestbook-1.2.2.tgz local
    $ helm repo update
    $ helm search repo guestbook

<!--

    cd v4

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

-->

<br/>

### 39 - Demo - Controlling Dependencies with Conditions and Tags

    $ cd v5

    $ helm install guestbook --set backend.enabled=false --set database.enabled=false
    $ helm install guestbook --set tags.api=false

<br/>

## 08 - Using Existing Helm Charts

<br/>

### Using a Stable MongoDB Chart

    $ cd apps/v6/chart

    $ ls guestbook/charts
    $ rm guestbook/charts/database-1.2.2.tgz

    $ helm repo list
    $ helm search repo mongodb
    $ helm inspect stable/mongodb | less

<br/>

    $ vi guestbook/requirements.yaml
    $ heml dependency update guestbook
    $ ls guestbook/charts

<br/>

    $ vi guestbook/values.yaml
    $ heml install dev guestbook

<br/>

### Installing Wordpress in Kubernetes in 1 Minute

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

### Remove everything

    $ helm delete guestbook
    $ helm repo remove local

<br/>

---

<br/>

**Marley**

Any questions in english: <a href="https://jsdev.org/chat/">Telegram Chat</a>  
Любые вопросы на русском: <a href="https://jsdev.ru/chat/">Телеграм чат</a>
