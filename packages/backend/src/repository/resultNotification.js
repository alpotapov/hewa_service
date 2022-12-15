const { ResultNotification } = require('./models/resultNotification');

const create = async (notification) => {
  const newNotification = await ResultNotification.create(notification);

  return newNotification;
};

module.exports = {
  create,
};
