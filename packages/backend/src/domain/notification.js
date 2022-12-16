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

const onTransactionSent = async (guid, transactionHash) => {
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

const sendPushNotification = async (pushToken) => {
  console.log('Sending push notification', pushToken);
};

const onTransactionMined = async (transactionHash) => {
  const notification = await resultNotificationRepository.findByTransactionHash(
    transactionHash,
  );

  if (!notification) {
    return;
  }

  await sendPushNotification(notification.pushToken);

  await resultNotificationRepository.update({
    guid: notification.guid,
    state: NotificationStates.RESULTREADY,
  });
};

const getAwaitedTransactions = async () => {
  const notifications = await resultNotificationRepository.findInState(
    NotificationStates.AWAITINGTRANSACTION,
  );

  return notifications.map((notification) => notification.transactionHash);
};

module.exports = {
  subscribe,
  onTransactionSent,
  onTransactionMined,
  getAwaitedTransactions,
};
