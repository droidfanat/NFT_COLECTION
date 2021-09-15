const bip39 = require('bip39');
const { hdkey } = require('ethereumjs-wallet');
require('dotenv').config()
const MNEMONIC_TESTNET_BSC = process.env.MNEMONIC_TESTNET_BSC;
//const hdk = hdkey.fromMasterSeed(seed);
// const addr_node = hdk.derivePath("m/44'/60'/0'/0/0"); //m/44'/60'/0'/0/0 is derivation path for the first account. m/44'/60'/0'/0/1 is the derivation path for the second account and so on
// const addr = addr_node.getWallet().getAddressString(); //check that this is the same with the address that ganache list for the first account to make sure the derivation is correct
// const private_key = addr_node.getWallet().getPrivateKey();
// console.log()

module.exports = async function(callback) {
    var hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(MNEMONIC_TESTNET_BSC));
    const addr_node = hdwallet.derivePath("m/44'/60'/0'/0/0"); //m/44'/60'/0'/0/0 is derivation path for the first account. m/44'/60'/0'/0/1 is the derivation path for the second account and so on
    const addr = addr_node.getWallet().getAddressString(); //check that this is the same with the address that ganache list for the first account to make sure the derivation is correct
    const private_key = addr_node.getWallet().getPrivateKey().toString('hex');
    console.log(private_key);
    }