
const ethers = require('ethers');

const prepareResult = async (pk, result, guid) => {
  const hash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`${result}${guid}`)
  );
  
  const wallet = new ethers.Wallet(pk);

  const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

  return {
    deviceAddress: wallet.address,
    signature,
  };
}

module.exports = {
  prepareResult
}
