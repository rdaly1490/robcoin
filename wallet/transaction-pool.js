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
}

module.exports = TransactionPool;
