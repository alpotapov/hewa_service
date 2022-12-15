const config = require('config');
const resultNotificationRepository = require('../repository/resultNotification');
const { NotificationStates } = require('../repository/models/resultNotification');
const artifacts = require('../contracts/hardhat_contracts.json');

const CHAIN_ID = config.get('chainId');
const CHAIN_NAME = config.get('chainName');
const { ResultRegistry } = artifacts[CHAIN_ID][CHAIN_NAME].contracts;
const DEFAULT_RESULT_REGISTRY_ADDRESS = ResultRegistry.address;

// eslint-disable-next-line no-unused-vars
const checkState = async (guid) => NotificationStates[0];

const subscribe = async (guid, resultRegistryAddress, pushToken) => {
  const state = await checkState(guid);
  const notification = await resultNotificationRepository.create({
    guid,
    pushToken,
    state,
    resultRegistryAddress: resultRegistryAddress || DEFAULT_RESULT_REGISTRY_ADDRESS,
  });

  return notification;
};

module.exports = {
  subscribe,
};
