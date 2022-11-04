// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async (hre) => {
  const { getNamedAccounts, deployments, getChainId } = hre;
  console.log({ hre: Object.keys(hre) });
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("HealthWalletAccess", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    // waitConfirmations: 5,
  });
};
module.exports.skip = () => new Promise((resolve) => resolve(true));
module.exports.tags = ["YourContract"];
