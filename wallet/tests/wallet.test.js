const TransactionPool = require("../transaction-pool");
const Wallet = require("../wallet");

describe("Wallet", () => {
  let pool, wallet;

  beforeEach(() => {
    pool = new TransactionPool();
    wallet = new Wallet();
  });

  describe("Creating a transaction", () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 40;
      recipient = "r4nd0m-4ddr355";
      transaction = wallet.createTransaction(recipient, sendAmount, pool);
    });

    describe("And doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, pool);
      });

      it("doubles the `sendAmount` subtracted from the wallet balance", () => {
        expect(
          transaction.outputs.find(
            output => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it("clones the `sendAmount` output for the recipient", () => {
        expect(
          transaction.outputs
            .filter(output => output.address === recipient)
            .map(output => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
