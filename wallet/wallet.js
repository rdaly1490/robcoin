const ChainUtil = require("../chain-util");
const Transaction = require("./transaction");
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

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) {
      console.log(
        `Amount: ${amount} exceeds current balance of ${this.balance}`
      );
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);
    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];

    // 1. Boil blockchain data down to an array of transactions
    blockchain.chain.forEach(block => {
      block.data.forEach(transaction => transactions.push(transaction));
    });

    // 2.  Filter all transactions down to those transactions that are just for this wallet's address
    const walletInputTransactions = transactions.filter(
      t => t.input.address === this.publicKey
    );

    // 3.  Find the most recent transaction from this wallet's transactions
    let startTime = 0;
    if (walletInputTransactions.length) {
      const recentInputTransaction = walletInputTransactions.reduce(
        (prev, current) =>
          prev.input.timeStamp > current.input.timeStamp ? prev : current
      );

      // 4. Can now change the balance to the one from the recent transaction and
      // modify the start time to this specific transactions timeStamp
      balance = recentInputTransaction.outputs.find(
        output => output.address === this.publicKey
      ).amount;
      startTime = recentInputTransaction.input.timeStamp;
    }

    // 4. Only add up outputs that have come after the most recent transaction
    transactions.forEach(transaction => {
      if (transaction.input.timeStamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    // Returns a wallet's overall balance
    return balance;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = "blockchain-wallet";
    return blockchainWallet;
  }
}

module.exports = Wallet;
