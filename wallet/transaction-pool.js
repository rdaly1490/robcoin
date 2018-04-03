const Transaction = require("./transaction");

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  // update an existing transaction in the pool or add a new one
  updateOrAddTransaction(transaction) {
    const transactionWithId = this.transactions.find(
      t => t.id === transaction.id
    );
    const transactionExistsInPool = !!transactionWithId;

    if (transactionExistsInPool) {
      const existingTransactionIndex = this.transactions.indexOf(
        transactionWithId
      );
      this.transactions[existingTransactionIndex] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }

  validTransactions() {
    // Conditions for validity:
    // 1. Total sum of output amounts matches input amount
    // 2. Verify the signature of every transaction to ensure the data was not corrupted at some point
    return this.transactions.filter(t => {
      const outputTotal = t.outputs.reduce((total, output) => {
        return total + output.amount;
      }, 0);

      if (outputTotal !== t.input.amount) {
        console.log(`Invalid transaction from address: ${t.input.address}`);
        return false;
      }

      if (!Transaction.verifyTransaction(t)) {
        console.log(`Invalid signature from address: ${t.input.address}`);
        return false;
      }

      return true;
    });
  }

  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;
