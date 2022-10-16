const { ethers } = require("hardhat");
const { expect } = require("chai");

const prepareTest = async () => {
  const contractFactory = await ethers.getContractFactory("ResultRegistry");
  const contract = await contractFactory.deploy();

  return {
    contract,
  };
};

const signResults = async (signer, contract, nonce, results) => {
  const hash = await contract.getMessageHash(results, nonce);
  const signature = await signer.signMessage(ethers.utils.arrayify(hash));

  return { signature, nonce };
};

describe("ResultRegistry", () => {
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("Authorizing devices", () => {
    it("should allow contract owner to authorize new devices", async () => {
      const { contract } = await prepareTest();
      const [, notOwner, device1, device2] = await ethers.getSigners();
      await expect(await contract.authorizeDevice(device1.address))
        .to.emit(contract, "Authorized")
        .withArgs(device1.address);

      await expect(contract.connect(notOwner).authorizeDevice(device2.address))
        .to.be.reverted;
    });

    it("should not emit event if device already authorized", async () => {
      const { contract } = await prepareTest();
      const [, , device1] = await ethers.getSigners();

      await contract.authorizeDevice(device1.address);
      await expect(await contract.authorizeDevice(device1.address)).to.not.emit(
        contract,
        "Authorized"
      );
    });

    it("should save result from the authorized device", async () => {
      const { contract } = await prepareTest();
      const [, , device1] = await ethers.getSigners();

      await contract.authorizeDevice(device1.address);

      const guid = "12345abc-12454adaf-1235435adasdf";
      const nonce = 1;
      const results = "0.12345";
      const { signature } = await signResults(
        device1,
        contract,
        nonce,
        results
      );

      await expect(
        await contract.publishResult(
          device1.address,
          guid,
          results,
          nonce,
          signature
        )
      )
        .to.emit(contract, "ResultPublished")
        .withArgs(guid);
    });
  });
});
