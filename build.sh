#!/bin/bash

git pull

npm run build

pm2 restart push_message@18000