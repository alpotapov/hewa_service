
const ethers = require('ethers');

const go = async (pk, result, guid) => {
  const createdAt = '';
  const hash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(`${result}${guid}`)
  );
  
  const wallet = new ethers.Wallet(pk);

  const signature = await wallet.signMessage(ethers.utils.arrayify(hash));

  return {
    deviceAddress: wallet.address,
    createdAt,
    signature,
  };
}

module.exports = {
  go
}
