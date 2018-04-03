const TransactionPool = require("../transaction-pool");
const Transaction = require("../transaction");
const Wallet = require("../wallet");
const Blockchain = require("../../blockchain/blockchain");

describe("TransactionPool", () => {
  let pool, wallet, transaction, blockchain;

  beforeEach(() => {
    pool = new TransactionPool();
    wallet = new Wallet();
    blockchain = new Blockchain();
    transaction = wallet.createTransaction("4ddr355", 30, blockchain, pool);
  });

  it("adds a transaction to the pool", () => {
    expect(pool.transactions.find(t => t.id === transaction.id)).toEqual(
      transaction
    );
  });

  it("updates a transaction in the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, "f00-4ddr355", 40);
    pool.updateOrAddTransaction(newTransaction);

    expect(
      JSON.stringify(pool.transactions.find(t => t.id === transaction.id))
    ).not.toEqual(oldTransaction);
  });

  it("clears transactions", () => {
    pool.clear();
    expect(pool.transactions).toEqual([]);
  });

  describe("mixing valid and corrupt transactions", () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...pool.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction("4ddr355", 30, blockchain, pool);
        if (i % 2 === 0) {
          //corrupt the transaction
          transaction.input.amount = 99999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it("shows a difference between valid and corrupt transactions", () => {
      expect(JSON.stringify(pool.transactions)).not.toEqual(validTransactions);
    });

    it("grabs valid transactions", () => {
      expect(pool.validTransactions()).toEqual(validTransactions);
    });
  });
});
