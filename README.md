# [Philippe Collignon] Packaging Applications with Helm for Kubernetes [ENG, 30 Jul 2019]


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

    $ minikube start

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

    $ curl https://raw.githubusercontent.com/helm/helm/master/scripts/get | bash

    $ kubectl config view 

    $ helm init

    $ helm version --short
    Client: v2.16.5+g89bd14c
    Server: v2.16.5+g89bd14c

    $ kubectl get all --namespace=kube-system -l name=tiller

<br/>

<!--

    $ helm create nginx-demo
    $ helm install nginx-demo
    $ kubectl get all | grep nginx-demo

-->

<br/>

### 09 - Configuring Helm Security

    $ helm reset
    $ kubectl create namespace lab

    $ cd lab04_tiller_serviceaccount/yaml
    $ kubectl create -f tiller-serviceaccount.yaml 
    $ kubectl create -f tiller-role.yaml
    $ kubectl create -f tiller-rolebinding.yaml 

    $ helm init --service-account tiller --tiller-namespace lab

    $ kubectl get all --namespace=lab



<br/>

### 10 - Running Tiller Locally

<br/>

![Application](/img/pic-04.png?raw=true)

    $ tiller
    $ helm init --client-only

<br/>

    $ export HELM_HOME=/home/$(whoami)/.helm
    $ export HELM_HOST=localhost:44134

    $ helm version --short
    Client: v2.16.5+g89bd14c
    Server: v2.16.5+g89bd14c

<br/>

    $ helm create nginx-localtiller-demo
    $ helm install nginx-localtiller-demo
    $ kubectl get all | grep localtiller
    $ kubectl get pod --namespace=kube-system -l name=tiller
    $ kubectl get configmaps --namespace=kube-system

<br/>

### 11 - Cleaning Helm


    $ helm list
    $ heml delete <some_package> --purge
    $ helm reset

<br/>

## 05 - Building Helm Charts


<br/>

### Release 1.0

    $ cd lab05_helm_chart_version1/chart/
    $ helm install guestbook

<br/>

    $ kubectl get pod -l app=frontend
    NAME                        READY   STATUS    RESTARTS   AGE
    frontend-5f667c694c-bdsdm   1/1     Running   0          44s

<br/>

    $ helm list --short
    exacerbated-toucan
    insipid-toad

<br/>

    $ helm status insipid-toad | less 

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

    $ helm upgrade insipid-toad guestbook

<br/>

![Application](/img/pic-06.png?raw=true)

<br/>

    $ helm list

<br/>

    $ helm history insipid-toad
    REVISION	UPDATED                 	STATUS    	CHART          APP VERSION	DESCRIPTION     
    1       	Sat Apr 11 04:54:47 2020	SUPERSEDED	guestbook-0.1.01.0        	Install complete
    2       	Sat Apr 11 05:03:37 2020	SUPERSEDED	guestbook-0.1.01.1        	Upgrade complete
    3       	Sat Apr 11 05:06:34 2020	DEPLOYED  	guestbook-0.1.01.0        	Rollback to 1   

<br/>

    $ helm delete insipid-toad --purge

<br/>

### Upgradint Release to version 2.0

    $ cd lab06_helm_chart_version2/chart
    

    // upgrade
    $ helm upgrade insipid-toad guestbook

or

    // install from scratch
    $ helm install guestbook

<br/>

    $ kubectl get pods
    NAME                        READY   STATUS    RESTARTS   AGE
    backend-5f68d76855-sdw2q    0/1     Error     1          51s
    frontend-74cc68bc89-qczj9   1/1     Running   0          51s
    mongodb-b96698956-zl459     1/1     Running   0          51s

<br/>

    $ helm list --short
    vocal-unicorn

<br/>

    $ helm status vocal-unicorn

http://frontend.minikube.local/

<br/>

![Application](/img/pic-07.png?raw=true)

<br/>

## 06 - Customizing Charts with Helm Templates

<br/>

![Application](/img/pic-08.png?raw=true)

<br/>

![Application](/img/pic-09.png?raw=true)

---

<a href="https://marley.org"><strong>Marley</strong></a>