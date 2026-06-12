#!/bin/bash

set -e

git pull origin main

pnpm install

pnpx prisma generate

pnpx prisma migrate deploy

pnpm run build

pm2 restart nextjs-app