const { ethers } = require("hardhat");
const { expect } = require("chai");

const signCreateRequest = async (signer, hwaContract, nonce) => {
  const message = "Create HealthWalletAccess token";
  const hash = await hwaContract.getMessageHash(message, nonce);
  const signature = await signer.signMessage(ethers.utils.arrayify(hash));

  return { signature, nonce };
};

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
      beforeEach(async () => {
        const HealthWalletAccess = await ethers.getContractFactory(
          "HealthWalletAccess"
        );

        hwaContract = await HealthWalletAccess.deploy();
      });
      it("should issue new HealthWalletAccess NFT to patient", async () => {
        const [, patient] = await ethers.getSigners();

        const nonce = 1;
        const { signature } = await signCreateRequest(
          patient,
          hwaContract,
          nonce
        );

        expect(
          await hwaContract.requestNewAccessToken(
            patient.address,
            nonce,
            signature,
            false
          )
        )
          .to.emit(hwaContract, "Transfer")
          .withArgs(0, patient.address);
      });

      it("should not allow more than one token per patient", async () => {
        const [, patient] = await ethers.getSigners();

        const nonce = 1;
        const { signature } = await signCreateRequest(
          patient,
          hwaContract,
          nonce
        );

        await hwaContract.requestNewAccessToken(
          patient.address,
          nonce,
          signature,
          true
        );

        const nonce2 = 2;
        const { signature: signature2 } = await signCreateRequest(
          patient,
          hwaContract,
          nonce2
        );

        await expect(
          hwaContract.requestNewAccessToken(
            patient.address,
            nonce2,
            signature2,
            false
          )
        ).to.be.reverted;
      });

      it("should require valid signature", async () => {
        const [, patient, otherGuy] = await ethers.getSigners();
        await expect(
          hwaContract.requestNewAccessToken(
            patient.address,
            0,
            ethers.utils.formatBytes32String("0xabc"),
            false
          )
        ).to.be.reverted;

        const nonce = 1;
        const { signature: invalidSignature } = await signCreateRequest(
          otherGuy,
          hwaContract,
          nonce
        );
        console.log("here");
        await expect(
          hwaContract.requestNewAccessToken(
            patient.address,
            nonce,
            invalidSignature,
            false
          )
        ).to.be.reverted;
      });

      it.skip("should assign admin as guardian", async () => {
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

      it.skip("should allow admin to transfer NFT to new patient address", async () => {
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
