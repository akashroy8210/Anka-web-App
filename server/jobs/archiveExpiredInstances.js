const SurpriseInstance = require('../models/SurpriseInstance');
const logger = require('../utils/logger');

/**
 * Job function to archive instances whose hosting duration (expiresAt) has passed.
 */
async function archiveExpiredInstances() {
  try {
    const now = new Date();
    const result = await SurpriseInstance.updateMany(
      {
        expiresAt: { $lte: now },
        archived: { $ne: true }
      },
      {
        $set: {
          archived: true,
          status: 'Archived'
        }
      }
    );

    if (result.modifiedCount > 0) {
      logger.info(`Archived ${result.modifiedCount} expired surprise instances.`);
    }
    return result;
  } catch (err) {
    logger.error('Error executing archiveExpiredInstances job:', err);
  }
}

module.exports = archiveExpiredInstances;
