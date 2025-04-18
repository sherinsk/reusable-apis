// src/utils/queue/emailQueue.js
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
require('dotenv').config();

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  maxRetriesPerRequest: null
});

const emailQueue = new Queue('emailQueue', { connection });

module.exports = { emailQueue,connection };
