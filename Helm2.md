## 07 - Managing Dependencies

<br/>

![Application](/img/pic-10.png?raw=true)

<br/>

### 35 - Demo - Packaging and Publishing Charts

**lab10**

    $ mv guestbook/charts dist
    $ cd dist

    $ helm package frontend backend database
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
    $ helm install guestbook
    $ helm list
    $ helm status brazen-quail
    $ helm delete brazen-quail --purge
    $ vi guestbook/requirements.lock

<br/>

    $ vi frontend/Chart.yaml

upd version

    $ helm package frontend

http://localhost:8879

    $ cd ..
    $ helm dependency build guestbook
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
    $ help search mongodb
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

