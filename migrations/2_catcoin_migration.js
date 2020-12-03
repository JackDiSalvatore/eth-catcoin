const CatCoin = artifacts.require("CatCoin");

module.exports = function (deployer) {
  const totalSupply = 3

  deployer.deploy(CatCoin, totalSupply);
};
