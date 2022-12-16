const { ResultNotification } = require('./models/resultNotification');

const create = async (notification) => {
  const newNotification = await ResultNotification.create(notification);

  return newNotification;
};

const update = async (notification) => {
  const updatedNotification = await ResultNotification.update(notification, {
    where: { guid: notification.guid },
  });

  return updatedNotification;
};

const exists = async (notification) => {
  const existingNotification = await ResultNotification.findOne({
    where: { guid: notification.guid },
  });

  return !!existingNotification;
};

const findInState = async (state) => {
  const notifications = await ResultNotification.findAll({
    where: { state },
  });

  return notifications;
};

const findByTransactionHash = async (transactionHash) => {
  const notification = await ResultNotification.findOne({ where: { transactionHash } });

  return notification;
};

module.exports = {
  create,
  update,
  exists,
  findInState,
  findByTransactionHash,
};
