const notificationDomain = require('../domain/notification');

const run = async () => {
  console.log('Transaction watcher started');

  setInterval(() => {
    notificationDomain.getAwaitedTransactions().then((transactions) => {
      console.log('Awaited transactions', transactions);
    });
  }, 10000);
};

module.exports = {
  run,
};
