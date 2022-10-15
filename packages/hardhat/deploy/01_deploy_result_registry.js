// deploy/01_deploy_your_contract.js

module.exports = async (hre) => {
  const { getNamedAccounts, deployments } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("ResultRegistry", {
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["ResultRegistry"];
