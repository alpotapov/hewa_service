const resultNotificationRepository = require('../repository/resultNotification');
const { NotificationStates } = require('../repository/models/resultNotification');
const pushNotificationService = require('../services/pushNotificationService');

const sendResultAvailableNotification = async (notification) => {
  await pushNotificationService.send(notification.pushToken, {
    body: 'Your result is ready',
    data: {
      guid: notification.guid,
    },
  });
};

const subscribe = async (guid, pushToken) => {
  const notification = await resultNotificationRepository.get(guid);
  if (!notification) {
    const newNotification = await resultNotificationRepository.create({
      guid,
      pushToken,
      state: NotificationStates.PENDING,
    });

    return newNotification;
  }

  if (notification.state === NotificationStates.AWAITING_PUSH_TOKEN) {
    await sendResultAvailableNotification(notification);
    const updatedNotification = await resultNotificationRepository.update({
      guid,
      pushToken,
      state: NotificationStates.SENT,
    });

    return updatedNotification;
  }

  const updatedNotification = await resultNotificationRepository.update({
    guid,
    pushToken,
  });

  return updatedNotification;
};

const onTransactionSent = async (guid, transactionHash) => {
  const notificationExists = await resultNotificationRepository.exists({
    guid,
  });

  if (!notificationExists) {
    await resultNotificationRepository.create({
      guid,
      transactionHash,
      state: NotificationStates.AWAITING_TRANSACTION,
    });

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
    throw new Error(`ResultNotification not found for ${transactionHash}`);
  }

  if (!notification.pushToken) {
    await resultNotificationRepository.update({
      guid: notification.guid,
      state: NotificationStates.AWAITING_PUSH_TOKEN,
    });

    return;
  }

  try {
    await sendResultAvailableNotification(notification);
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
