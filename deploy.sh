#!/bin/bash

set -e

git pull origin main

npm install

npx prisma generate

npx prisma migrate deploy

npm run build

pm2 restart nextjs-app