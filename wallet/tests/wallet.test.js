const TransactionPool = require("../transaction-pool");
const Wallet = require("../wallet");
const Blockchain = require("../../blockchain/blockchain");
const { INITIAL_BALANCE } = require("../../config");

describe("Wallet", () => {
  let pool, wallet, blockchain;

  beforeEach(() => {
    pool = new TransactionPool();
    wallet = new Wallet();
    blockchain = new Blockchain();
  });

  describe("Creating a transaction", () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 40;
      recipient = "r4nd0m-4ddr355";
      transaction = wallet.createTransaction(
        recipient,
        sendAmount,
        blockchain,
        pool
      );
    });

    describe("And doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, blockchain, pool);
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

  describe("calculating a balance", () => {
    let addBalance, repeatAdd, senderWallet;

    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(
          wallet.publicKey,
          addBalance,
          blockchain,
          pool
        );
      }
      blockchain.addBlock(pool.transactions);
    });

    it("calculates the balance for blockchain transactions matching the recipient", () => {
      expect(wallet.calculateBalance(blockchain)).toEqual(
        INITIAL_BALANCE + addBalance * repeatAdd
      );
    });

    it("calculates the balance for blockchain transactions matching the sender", () => {
      expect(senderWallet.calculateBalance(blockchain)).toEqual(
        INITIAL_BALANCE - addBalance * repeatAdd
      );
    });

    describe("and the recipient conducts a transaction", () => {
      let subtractBalance, recipientBalance;

      beforeEach(() => {
        pool.clear();
        subtractBalance = 60;
        recipientBalance = wallet.calculateBalance(blockchain);
        wallet.createTransaction(
          senderWallet.publicKey,
          subtractBalance,
          blockchain,
          pool
        );
        blockchain.addBlock(pool.transactions);
      });

      describe("and the sender sends another transaction to the recipient", () => {
        beforeEach(() => {
          pool.clear();
          senderWallet.createTransaction(
            wallet.publicKey,
            addBalance,
            blockchain,
            pool
          );
          blockchain.addBlock(pool.transactions);
        });

        it("calculates the recipient's balance only using transactions since its most recent one", () => {
          expect(wallet.calculateBalance(blockchain)).toEqual(
            recipientBalance - subtractBalance + addBalance
          );
        });
      });
    });
  });
});
