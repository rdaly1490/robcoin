const Block = require("./block");

class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const newBlock = Block.mineBlock(lastBlock, data);
    this.chain.push(newBlock);

    return newBlock;
  }

  // Need to determine if miner's updated chain is valid before broadcasting to network
  isValidChain(chain) {
    //1. Check the incoming chain starts with the correct genesis block
    const incomingChainGenesis = JSON.stringify(chain[0]);
    const ourChainGenesis = JSON.stringify(Block.genesis());
    if (incomingChainGenesis !== ourChainGenesis) return false;
    //2. New chain must be longer than our current chain
    if (chain.length <= this.chain.length) return false;

    //3. Check that the blocks in the chain are all valid
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const previousBlock = chain[i - 1];
      //3a. Ensure the previousHash of our current block equals our previous block's hash
      if (block.lastHash !== previousBlock.hash) return false;

      //3b. Ensure block's data hasn't been tampered with (i.e. generated hash is incorrect)
      if (block.hash !== Block.getHashForBlock(block)) return false;

      return true;
    }
  }

  // Update our blockchain to the incoming one from the miner if it is valid
  replaceChain(newChain) {
    const isInvalidChain = !this.isValidChain(newChain);
    if (isInvalidChain) return;

    this.chain = newChain;
  }
}

module.exports = BlockChain;
