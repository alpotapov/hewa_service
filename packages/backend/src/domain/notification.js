const resultNotificationRepository = require('../repository/resultNotification');
const { NotificationStates } = require('../repository/models/resultNotification');
const pushNotificationService = require('../services/pushNotificationService');

const subscribe = async (guid, pushToken) => {
  // TODO: do not create ResultNotification if result is already available
  const notification = await resultNotificationRepository.create({
    guid,
    pushToken,
    state: NotificationStates.PENDING,
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
    state: NotificationStates.AWAITING_TRANSACTION,
  });
};

const onTransactionMined = async (transactionHash) => {
  const notification = await resultNotificationRepository.findByTransactionHash(
    transactionHash,
  );

  if (!notification) {
    return;
  }

  try {
    await pushNotificationService.send(notification.pushToken, {
      body: 'Your result is ready',
      data: {
        guid: notification.guid,
      },
    });
  } catch (error) {
    await resultNotificationRepository.update({
      guid: notification.guid,
      state: NotificationStates.FAILED,
    });

    throw error;
  }

  await resultNotificationRepository.update({
    guid: notification.guid,
    state: NotificationStates.SENT,
  });
};

const getAwaitedTransactions = async () => {
  const notifications = await resultNotificationRepository.findInState(
    NotificationStates.AWAITING_TRANSACTION,
  );

  return notifications.map((notification) => notification.transactionHash);
};

module.exports = {
  subscribe,
  onTransactionSent,
  onTransactionMined,
  getAwaitedTransactions,
};
