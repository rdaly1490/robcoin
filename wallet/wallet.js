const ChainUtil = require("../chain-util");
const { INITIAL_BALANCE } = require("../config");

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex"); // create and encode wallets public key
  }

  toString() {
    return `Wallet -
      PublicKey : ${this.publicKey.toString()}
      Balance   : ${this.balance.toString()}
    `;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }
}

module.exports = Wallet;
