const { Expo } = require('expo-server-sdk');

class PushNotificationDeliveryImpossible extends Error {
  constructor(message, pushToken) {
    super(message);
    this.name = 'PushNotificationDeliveryImpossible';
    this.pushToken = pushToken;
  }
}

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const send = async (pushToken, notification) => {
  console.log('Sending push notification', pushToken);

  if (!Expo.isExpoPushToken(pushToken)) {
    throw new PushNotificationDeliveryImpossible('Invalid Expo push token', pushToken);
  }

  const messages = [
    {
      to: pushToken,
      sound: 'default',
      body: notification.body,
      data: notification.data,
    },
  ];

  const chunks = expo.chunkPushNotifications(messages);
  try {
    const ticketChunks = await Promise.all(
      chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk)),
    );
    const tickets = ticketChunks.reduce((acc, ticketChunk) => [...acc, ...ticketChunk], []);
    console.log(JSON.stringify(tickets, null, 2));
    return tickets.map((ticket) => ticket.id);
  } catch (error) {
    console.error(error);
    throw new PushNotificationDeliveryImpossible(error.message, pushToken);
  }
};

module.exports = { send };
