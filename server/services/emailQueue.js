/**
 * Asynchronous Background Email & Job Queue Worker Service
 * Supports BullMQ Redis queue worker when REDIS_URL is provided,
 * with fallback to in-memory non-blocking background queue worker.
 */

const emailService = require('./emailService');
const logger = require('../utils/logger');

let bullQueue = null;

// Initialize BullMQ if REDIS_URL or REDIS_HOST is set
if (process.env.REDIS_URL || process.env.REDIS_HOST) {
  try {
    const { Queue, Worker } = require('bullmq');
    const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:6379`;
    const connection = { url: redisUrl };

    bullQueue = new Queue('email-queue', { connection });

    const worker = new Worker('email-queue', async job => {
      logger.info(`[BullMQ] Processing email job (${job.name}) for ${job.data.customerEmail}`);
      if (job.name === 'credentials') {
        await emailService.sendSurpriseCredentialsEmail(job.data);
      } else if (job.name === 'wedding') {
        await emailService.sendWeddingOrderEmails(job.data);
      }
    }, { connection, attempts: 3, backoff: { type: 'exponential', delay: 2000 } });

    worker.on('completed', job => {
      logger.info(`[BullMQ] Job ${job.id} (${job.name}) completed successfully.`);
    });

    worker.on('failed', (job, err) => {
      logger.error(`[BullMQ] Job ${job?.id} failed: ${err.message}`);
    });

    logger.info('[EmailQueue] Successfully initialized BullMQ Redis queue worker.');
  } catch (err) {
    logger.info('[EmailQueue] Operating with in-memory background email worker.');
  }
}

class EmailQueueWorker {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
  }

  /**
   * Queue Credentials Email
   */
  enqueueCredentialsEmail(info) {
    if (bullQueue) {
      bullQueue.add('credentials', info, { attempts: 3, backoff: 2000 }).catch(err => {
        logger.error(`[BullMQ] Failed to add credentials job to Redis: ${err.message}`);
      });
      return;
    }
    this.queue.push({
      type: 'credentials',
      payload: info,
      retries: 0,
      createdAt: new Date()
    });
    logger.info(`[EmailQueue] Queued credentials email job for: ${info.customerEmail}`);
    this.processNext();
  }

  /**
   * Queue Wedding Order Email
   */
  enqueueWeddingEmail(orderInfo) {
    if (bullQueue) {
      bullQueue.add('wedding', orderInfo, { attempts: 3, backoff: 2000 }).catch(err => {
        logger.error(`[BullMQ] Failed to add wedding job to Redis: ${err.message}`);
      });
      return;
    }
    this.queue.push({
      type: 'wedding',
      payload: orderInfo,
      retries: 0,
      createdAt: new Date()
    });
    logger.info(`[EmailQueue] Queued wedding order email job for: ${orderInfo.customerEmail}`);
    this.processNext();
  }

  /**
   * Asynchronous Non-blocking Processing Worker
   */
  async processNext() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const job = this.queue.shift();

    try {
      if (job.type === 'credentials') {
        await emailService.sendSurpriseCredentialsEmail(job.payload);
        logger.info(`[EmailQueue] Successfully processed credentials email for ${job.payload.customerEmail}`);
      } else if (job.type === 'wedding') {
        await emailService.sendWeddingOrderEmails(job.payload);
        logger.info(`[EmailQueue] Successfully processed wedding order email for ${job.payload.customerEmail}`);
      }
    } catch (err) {
      logger.error(`[EmailQueue] Failed to process email job (${job.type}) for ${job.payload?.customerEmail}: ${err.message}`);
      job.retries += 1;
      if (job.retries < this.maxRetries) {
        logger.warn(`[EmailQueue] Re-queueing failed email job (Attempt ${job.retries}/${this.maxRetries})`);
        this.queue.push(job);
      } else {
        logger.error(`[EmailQueue] Max retries reached for email job (${job.payload?.customerEmail}). Dead-letter logged.`);
      }
    } finally {
      this.isProcessing = false;
      if (this.queue.length > 0) {
        setImmediate(() => this.processNext());
      }
    }
  }
}

const emailQueueWorker = new EmailQueueWorker();
module.exports = emailQueueWorker;
