const notificationDomain = require('../domain/notification');
const transactionDomain = require('../domain/transaction');

const run = async () => {
  console.log('Transaction watcher started');

  setInterval(() => {
    notificationDomain.getAwaitedTransactions().then((transactionHashes) => {
      Promise.all(transactionHashes.map((txHash) => transactionDomain.isMined(txHash))).then(
        (results) => {
          results.forEach((isMined, index) => {
            if (isMined) {
              notificationDomain
                .onTransactionMined(transactionHashes[index])
                .catch((error) => console.warn(
                  `notificationDomain.onTransactionMined handler failed: ${error.message}`,
                ));
            }
          });
        },
      );
    });
  }, 10000);
};

module.exports = {
  run,
};
