const SHA256 = require("crypto-js/sha256");
const { DIFFICULTY } = require("../config");

class Block {
  constructor(timeStamp, lastHash, hash, data, nonce) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timeStamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash     : ${this.hash.substring(0, 10)}
      Nonce    : ${this.nonce}
      Data     : ${this.data}`;
  }

  static genesis() {
    return new this("Dawn of Time", "-----", "f1rst-h4sh", [], 0);
  }

  static mineBlock(lastBlock, data) {
    let hash, timeStamp;
    let nonce = 0;
    const lastHash = lastBlock.hash;

    do {
      nonce++;
      timeStamp = Date.now();
      hash = Block.generateHash(timeStamp, lastHash, data, nonce);
      // while condition checks that we have correct number of leading 0's in hash
      // to match the difficulty requirements
    } while (hash.substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY));

    return new this(timeStamp, lastHash, hash, data, nonce);
  }

  static generateHash(timeStamp, lastHash, data, nonce) {
    // Fn input is string of unique data we'd like to gen hash from
    // method returns an object with toString method which returns hash
    return SHA256(`${timeStamp}${lastHash}${data}${nonce}`).toString();
  }

  static getHashForBlock(block) {
    const { timeStamp, lastHash, data, nonce } = block;
    return Block.generateHash(timeStamp, lastHash, data, nonce);
  }
}

module.exports = Block;
