const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ResultRegistry", () => {
  let contract;

  before((done) => {
    setTimeout(done, 2000);
  });

  describe("Authorizing devices", () => {
    it("should allow contract owner to authorize new devices", async () => {
      const contractFactory = await ethers.getContractFactory("ResultRegistry");
      contract = await contractFactory.deploy();

      const [, notOwner, device1, device2] = await ethers.getSigners();

      await expect(await contract.authorizeDevice(device1.address))
        .to.emit(contract, "Authorized")
        .withArgs(device1.address);

      console.log("this shouldn't work...");

      await expect(contract.connect(notOwner).authorizeDevice(device2.address))
        .to.be.reverted;
    });
  });
});
