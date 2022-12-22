const { DataTypes } = require('sequelize');
const db = require('../../../db');

const NotificationStates = {
  PENDING: 'PENDING',
  AWAITING_DEVICE_OUTPUT: 'AWAITING_DEVICE_OUTPUT',
  AWAITING_TRANSACTION: 'AWAITING_TRANSACTION',
  AWAITING_PUSH_TOKEN: 'AWAITING_PUSH_TOKEN',
  SENT: 'SENT',
  FAILED: 'FAILED',
};

const ResultNotification = db.sequelize.define('ResultNotification', {
  guid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pushToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  state: {
    type: DataTypes.ENUM(Object.keys(NotificationStates).map((key) => NotificationStates[key])),
    allowNull: false,
  },
  transactionHash: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = {
  NotificationStates,
  ResultNotification,
};
