#!/usr/bin/env bash

# export device IP
echo "REACT_NATIVE_PACKAGER_HOSTNAME=$(ipconfig getifaddr en0)" > .env

docker compose up --force-recreate