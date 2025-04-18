const { Worker } = require('bullmq');
const sendMail = require('../sendMail');
const { connection } = require('./emailQueue');

const startEmailWorker = () => {
  const worker = new Worker('emailQueue', async (job) => {
    const { to, subject, text } = job.data;
    await sendMail({ to, subject, text });
    console.log(`📧 Email sent to ${to}`);
  }, {
    connection,
  });

  worker.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err);
  });
};

module.exports = startEmailWorker;
