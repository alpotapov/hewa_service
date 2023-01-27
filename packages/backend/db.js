const { Sequelize } = require('sequelize');
const config = require('config');

const constructDbUrl = (host, dbName, user, password) => {
  if (!host || !dbName || !user || !password) {
    return null;
  }

  return `postgres://${user}:${password}@${host}:5432/${dbName}`;
};

const { host, name: dbName, user } = config.db;
const password = process.env.DB_PASSWORD;
const dbUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : constructDbUrl(host, dbName, user, password);

const sequelizeOptions = process.env.DB_USE_SSL ? {
  dialect: 'postgres',
  dialectOptions: { ssl: { rejectUnauthorized: false } },
} : {};

if (!dbUrl) {
  throw new Error('Database credentials missing');
}

const sequelize = new Sequelize(dbUrl, sequelizeOptions);

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database: Connected to PostgreSQL');
  } catch (err) {
    console.error('Failed to connect', err);
  }
};

module.exports = {
  sequelize,
  testConnection: connect,
};
