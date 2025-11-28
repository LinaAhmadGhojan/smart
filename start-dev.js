#!/usr/bin/env node
require('dotenv').config();
require('tsx').createRequire(import.meta.url)('./server/index-dev.ts');
