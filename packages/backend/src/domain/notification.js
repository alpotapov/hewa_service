const resultNotificationRepository = require('../repository/resultNotification');
const { NotificationStates } = require('../repository/models/resultNotification');

// eslint-disable-next-line no-unused-vars
const checkState = async (guid) => NotificationStates.PENDING;

const subscribe = async (guid, pushToken) => {
  const state = await checkState(guid);
  const notification = await resultNotificationRepository.create({
    guid,
    pushToken,
    state,
  });

  return notification;
};

const transactionSent = async (guid, transactionHash) => {
  const notificationExists = await resultNotificationRepository.exists({
    guid,
  });

  if (!notificationExists) {
    return;
  }

  await resultNotificationRepository.update({
    guid,
    transactionHash,
    state: NotificationStates.AWAITINGTRANSACTION,
  });
};

module.exports = {
  subscribe,
  transactionSent,
};
