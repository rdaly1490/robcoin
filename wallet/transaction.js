const ChainUtil = require("../chain-util");

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

  static newTransaction(senderWallet, recipient, amount) {
    const transaction = new this();

    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance`);
      return;
    }

    // Outputs consist of 2 things: How much balance they have remaining after a transaction &
    // how much the person is sending in the transaction.  And a publicKey address for each.
    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey
        },
        {
          amount,
          address: recipient
        }
      ]
    );

    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
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
