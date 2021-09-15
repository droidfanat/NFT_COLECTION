const MetaSpheres = artifacts.require('MetaSpheres');
module.exports = function(deployer, network, accounts) {
  if (deployer.network === 'test' && deployer.network === 'development') {
    return;
  }
  deployer.deploy(MetaSpheres);
};




