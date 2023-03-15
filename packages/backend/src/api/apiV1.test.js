const request = require('supertest');
const express = require('express');

const dotenv = require('dotenv');

dotenv.config({ path: './.env.test' });

const app = express();
const deviceRouter = require('./device');

app.use(express.json());
app.use('/api/v1/device', deviceRouter);

const resultRegistryDomain = require('../domain/resultRegistry');
const notificationDomain = require('../domain/notification');

describe('uploadResult endpoint', () => {
  test('should successfully upload a result and return transactionHash, guid, and deviceAddress', async () => {
    // Prepare the request payload
    const payload = {
      guid: 'some-guid',
      deviceAddress: '0x12345...',
      result: 'some-cid',
      signature: 'some-signature',
      stringifiedResult: '{"some": "result"}',
    };

    // Mock the uploadResultToIpfs and uploadResult functions to return expected results
    resultRegistryDomain.uploadResultToIpfs = jest.fn().mockResolvedValue(payload.result);
    resultRegistryDomain.uploadResult = jest.fn().mockResolvedValue({ transactionHash: 'some-tx-hash' });
    notificationDomain.onTransactionSent = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post('/api/v1/device/upload-result')
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body.transactionHash).toBe('some-tx-hash');
    expect(response.body.guid).toBe(payload.guid);
    expect(response.body.deviceAddress).toBe(payload.deviceAddress);
  });
});
