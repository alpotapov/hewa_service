const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("HealthWallet Backup", function () {
  let hwaContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("HealthWalletAccess", function () {
    it("Should deploy HealthWalletAccess", async function () {
      const HealthWalletAccess = await ethers.getContractFactory(
        "HealthWalletAccess"
      );

      hwaContract = await HealthWalletAccess.deploy();
    });

    describe("requestNewAccessToken()", function () {
      it("should issue new HealthWalletAccess NFT to patient", async () => {
        const [, patient] = await ethers.getSigners();

        expect(await hwaContract.requestNewAccessToken(patient.address, false))
          .to.emit(hwaContract, "Transfer")
          .withArgs(0, patient.address);
      });

      it("should assign admin as guardian", async () => {
        const [owner, patient, otherGuy] = await ethers.getSigners();
        const tx = await hwaContract.requestNewAccessToken(
          patient.address,
          true
        );
        const res = await tx.wait();
        const { tokenId } = res.events[0].args;
        expect(await hwaContract.isGuardian(owner.address, tokenId)).to.equal(
          true
        );
        expect(
          await hwaContract.isGuardian(otherGuy.address, tokenId)
        ).to.equal(false);
      });

      it("should allow admin to transfer NFT to new patient address", async () => {
        const [, oldPatientAddress, patient, otherGuy] =
          await ethers.getSigners();
        const tx = await hwaContract.requestNewAccessToken(
          oldPatientAddress.address,
          true
        );
        const res = await tx.wait();
        const { tokenId } = res.events[0].args;
        await expect(
          hwaContract
            .connect(otherGuy)
            .transferFrom(oldPatientAddress.address, patient.address, tokenId)
        ).to.be.reverted;
        await hwaContract.transferFrom(
          oldPatientAddress.address,
          patient.address,
          tokenId
        );
        expect(await hwaContract.ownerOf(tokenId)).to.equal(patient.address);
      });
    });
  });
});
