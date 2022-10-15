const { ethers } = require("hardhat");
const { expect } = require("chai");

const prepareTest = async () => {
  const contractFactory = await ethers.getContractFactory("ResultRegistry");
  const contract = await contractFactory.deploy();

  return {
    contract,
  };
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
  });
});
