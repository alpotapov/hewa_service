const { DataTypes } = require('sequelize');
const db = require('../../../db');

const NotificationStates = {
  PENDING: 'PENDING',
  TESTONGOING: 'TESTONGOING',
  AWAITINGTRANSACTION: 'AWAITINGTRANSACTION',
  RESULTREADY: 'RESULTREADY',
};

const ResultNotification = db.sequelize.define('ResultNotification', {
  guid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pushToken: {
    type: DataTypes.TEXT,
    allowNull: false,
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
