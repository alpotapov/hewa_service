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
    wbhere: { guid: notification.guid },
  });

  return !!existingNotification;
};

const findInState = async (state) => {
  const notifications = await ResultNotification.findAll({
    where: { state },
  });

  return notifications;
};

module.exports = {
  create,
  update,
  exists,
  findInState,
};
