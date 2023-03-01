const { DataTypes } = require('sequelize');
const db = require('../../../db');

const NotificationStates = {
  PENDING: 'PENDING',
  AWAITING_DEVICE_OUTPUT: 'AWAITING_DEVICE_OUTPUT',
  AWAITING_TRANSACTION: 'AWAITING_TRANSACTION',
  SENT: 'SENT',
  FAILED: 'FAILED',
};

const ResultNotification = db.sequelize.define('ResultNotification', {
  guid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'componsitIndex',
  },
  pushToken: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: 'componsitIndex',
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
