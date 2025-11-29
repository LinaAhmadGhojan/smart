@echo off
setlocal enabledelayedexpansion
set NODE_ENV=development
npx tsx server/index-dev.ts
