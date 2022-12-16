const ethers = require('ethers');
const uuid = require('uuid').v4;

const prepareResult = async (pk, result, guid) => {
  const hash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`${result}${guid}`),
  );

  const wallet = new ethers.Wallet(pk);

  const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

  return {
    deviceAddress: wallet.address,
    signature,
  };
};

const generateNewResult = async (pk) => {
  const guid = uuid();
  const result = Math.floor(Math.random() * (150 - 50 + 1) + 50).toString();
  const { deviceAddress, signature } = await prepareResult(pk, result, guid);

  return JSON.stringify({
    guid,
    result,
    deviceAddress,
    signature,
  });
};

module.exports = {
  prepareResult,
  generateNewResult,
};
