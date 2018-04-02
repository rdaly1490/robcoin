const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet/wallet");

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    // 1. Grab valid transactions from the pool
    const validTransactions = this.transactionPool.validTransactions();

    // 1a. Include a reward for the miner at the end of the transactions list
    const rewardTransaction = Transaction.rewardTransaction(
      this.wallet,
      Wallet.blockchainWallet()
    );
    validTransactions.push(rewardTransaction);

    // 2. Take those transactions and create a block whose data consists of those transactions
    const block = this.blockchain.addBlock(validTransactions);

    // 3. Tell p2pServer to synchronize chains and to include the new block in the blockchain
    this.p2pServer.syncChains();

    // 4. Tell the transaction pool to clear itself of these transactions locally and across the network
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;
