# [Philippe Collignon] Packaging Applications with Helm for Kubernetes [ENG, 30 Jul 2019]

**Original src:**  
https://github.com/phcollignon/helm

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
