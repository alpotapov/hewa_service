const ethers = require('ethers');
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const resultRegistryDomain = require('./resultRegistry');

const { PK_DEMO_APP } = process.env;

const getDemoFhirRecord = (value) => {
  const filePath = path.join(__dirname, 'demoFhir.txt');
  return readFile(filePath, 'utf8')
    .then((data) => {
      const updatedData = data.replace(/##VALUE##/g, value);
      return updatedData;
    })
    .catch((err) => {
      console.error('Error reading the file:', err);
      throw err;
    });
};

const signResult = async (pk, result, guid) => {
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

const uploadResult = async (uuid, fhirRecord) => {
  const resultAsBuffer = Buffer.from(fhirRecord);
  const cid = await resultRegistryDomain.calculateCid(fhirRecord);
  const { deviceAddress, signature } = await signResult(
    PK_DEMO_APP,
    cid,
    uuid,
  );
  console.log('Using demo app to upload result', {
    deviceAddress, signature, cid, uuid,
  });
  const output = await resultRegistryDomain.uploadResult({
    guid: uuid, result: cid, stringifiedResult: resultAsBuffer.toString(), deviceAddress, signature,
  });

  return output;
};

module.exports = {
  uploadResult,
  getDemoFhirRecord,
};
