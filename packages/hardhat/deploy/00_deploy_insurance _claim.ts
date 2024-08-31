import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployInsuranceClaim: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("InsureClaim", {
    from: deployer,
    log: true,
  });
};

export default deployInsuranceClaim;
deployInsuranceClaim.tags = ["InsureClaim"];
