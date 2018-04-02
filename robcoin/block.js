const SHA256 = require("crypto-js/sha256");
const { DIFFICULTY, MINE_RATE } = require("../config");

class Block {
  constructor(timeStamp, lastHash, hash, data, nonce, difficulty) {
    this.timeStamp = timeStamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timeStamp}
      Last Hash : ${this.lastHash.substring(0, 10)}
      Hash      : ${this.hash.substring(0, 10)}
      Nonce     : ${this.nonce}
      Difficulty: ${this.difficulty}
      Data      : ${this.data}`;
  }

  static genesis() {
    return new this("Dawn of Time", "-----", "f1rst-h4sh", [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    let hash, timeStamp;
    let nonce = 0;
    let { difficulty } = lastBlock;
    const lastHash = lastBlock.hash;

    do {
      nonce++;
      timeStamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timeStamp);
      hash = Block.generateHash(timeStamp, lastHash, data, nonce, difficulty);
      // while condition checks that we have correct number of leading 0's in hash
      // to match the difficulty requirements
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this(timeStamp, lastHash, hash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    const blocksMinedTooFast = lastBlock.timeStamp + MINE_RATE > currentTime;
    difficulty = blocksMinedTooFast ? difficulty + 1 : difficulty - 1;
    return difficulty;
  }

  static generateHash(timeStamp, lastHash, data, nonce, difficulty) {
    // Fn input is string of unique data we'd like to gen hash from
    // method returns an object with toString method which returns hash
    return SHA256(
      `${timeStamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString();
  }

  static getHashForBlock(block) {
    const { timeStamp, lastHash, data, nonce, difficulty } = block;
    return Block.generateHash(timeStamp, lastHash, data, nonce, difficulty);
  }
}

module.exports = Block;
