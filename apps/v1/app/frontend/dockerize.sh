#!/bin/bash
ng build --prod 
docker build  -f Dockerfile -t frontend .
docker tag frontend webmakaka/frontend:2.0
docker push webmakaka/frontend:2.0
