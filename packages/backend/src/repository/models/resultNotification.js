const { DataTypes } = require('sequelize');
const db = require('../../../db');

const NotificationStates = [
  'PENDING', 'TESTONGOING', 'RESULTREADY',
];

const ResultNotification = db.sequelize.define('ResultNotification', {
  guid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resultRegistryAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pushToken: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  state: {
    type: DataTypes.ENUM(NotificationStates),
  },
});

module.exports = {
  NotificationStates,
  ResultNotification,
};
