#!/bin/bash

docker build --tag alpotapov/hewa_service:latest --platform linux/amd64 .

docker tag alpotapov/hewa_service registry.heroku.com/hewa-service/web
