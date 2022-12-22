const { Sequelize } = require('sequelize');
const config = require('config');

const { host, name: dbName, user } = config.db;
const password = process.env.DB_PASSWORD;

if (!host || !dbName || !user || !password) {
  throw new Error('Database credentials missing');
}

const sequelize = new Sequelize(
  `postgres://${user}:${password}@${host}:5432/${dbName}`,
);

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database: Connected to ${user}@${host}:5432/${dbName}`);
  } catch (err) {
    console.error('Failed to connect', err);
  }
};

module.exports = {
  sequelize,
  testConnection: connect,
};
