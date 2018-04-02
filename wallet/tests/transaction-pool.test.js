const TransactionPool = require("../transaction-pool");
const Transaction = require("../transaction");
const Wallet = require("../wallet");

describe("TransactionPool", () => {
  let pool, wallet, transaction;

  beforeEach(() => {
    pool = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, "4ddr355", 30);
    pool.updateOrAddTransaction(transaction);
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
});
