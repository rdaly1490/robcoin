const ChainUtil = require("../chain-util");
const { MINING_REWARD } = require("../config");

class Transaction {
  constructor() {
    this.id = ChainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  toString() {
    return `Transaction -
      UUID   : ${this.id.toString()}
      Input  : ${JSON.stringify(this.input)}
      Outputs: ${JSON.stringify(this.outputs)}
    `;
  }

  // Handles adding a new output object and resigns the transaction:
  // Don't need to create a whole new transaction object if the user wants to send more currency
  // within a short time frame.  Just add more outputs to the original transaction and resign it.
  update(senderWallet, recipient, amount) {
    const senderOutput = this.outputs.find(
      output => output.address === senderWallet.publicKey
    );

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance`);
      return;
    }

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance`);
      return;
    }

    // Outputs consist of 2 main things across n transactions:
    // 1. How much balance they have remaining after all other n transactions and their address.
    // 2. How much the person is sending in each of the n transaction and to what addresses.
    const outputs = [
      {
        amount: senderWallet.balance - amount,
        address: senderWallet.publicKey
      },
      {
        amount,
        address: recipient
      }
    ];

    return Transaction.transactionWithOutputs(senderWallet, outputs);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    const outputs = [
      {
        amount: MINING_REWARD,
        address: minerWallet.publicKey
      }
    ];
    return Transaction.transactionWithOutputs(blockchainWallet, outputs);
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timeStamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    };
  }

  static verifyTransaction(transaction) {
    const { input, outputs } = transaction;
    const { address, signature } = input;
    return ChainUtil.verifySignature(
      address,
      signature,
      ChainUtil.hash(outputs)
    );
  }
}

module.exports = Transaction;
