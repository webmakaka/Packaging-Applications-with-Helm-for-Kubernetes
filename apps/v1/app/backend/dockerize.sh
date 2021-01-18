#!/bin/bash
docker build  -f Dockerfile -t backend .
docker tag backend webmakaka/backend:2.0
docker push webmakaka/backend:2.0
