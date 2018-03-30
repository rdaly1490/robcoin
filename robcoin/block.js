const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(timeStamp, lastHash, hash, data) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timeStamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash     : ${this.hash.substring(0, 10)}
      Data     : ${this.data}`;
  }

  static genesis() {
    return new this("Dawn of Time", "-----", "f1rst-h4sh", []);
  }

  static mineBlock(lastBlock, data) {
    const timeStamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.generateHash(timeStamp, lastHash, data);

    return new this(timeStamp, lastHash, hash, data);
  }

  static generateHash(timeStamp, lastHash, data) {
    // Fn input is string of unique data we'd like to gen hash from
    // method returns an object with toString method which returns hash
    return SHA256(`${timeStamp}${lastHash}${data}`).toString();
  }

  static getHashForBlock(block) {
    const { timeStamp, lastHash, data } = block;
    return Block.generateHash(timeStamp, lastHash, data);
  }
}

module.exports = Block;
