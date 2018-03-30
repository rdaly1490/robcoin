const BlockChain = require("../blockchain");
const Block = require("../block");

describe("Blockchain", () => {
  let blockchain, incomingBlockchain;

  beforeEach(() => {
    blockchain = new BlockChain();
    incomingBlockchain = new BlockChain();
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block", () => {
    const data = "foo";
    blockchain.addBlock(data);

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  it("confirms a valid incoming chain is valid", () => {
    incomingBlockchain.addBlock("foo");

    expect(blockchain.isValidChain(incomingBlockchain.chain)).toBe(true);
  });

  it("invalidates an incoming chain with a corrupt genesis block", () => {
    incomingBlockchain.chain[0].data = "bad data";

    expect(blockchain.isValidChain(incomingBlockchain.chain)).toBe(false);
  });

  it("invalidates an incoming corrupt chain", () => {
    incomingBlockchain.addBlock("foo");
    incomingBlockchain.chain[1].data = "bar";

    expect(blockchain.isValidChain(incomingBlockchain.chain)).toBe(false);
  });

  it("replaces the chain with a valid chain", () => {
    incomingBlockchain.addBlock("foo");
    blockchain.replaceChain(incomingBlockchain.chain);

    expect(blockchain.chain).toEqual(incomingBlockchain.chain);
  });

  it("does not replace the chain with one that is shorter or equal length", () => {
    incomingBlockchain.addBlock("foo");
    blockchain.addBlock("bar");
    blockchain.replaceChain(incomingBlockchain.chain);

    expect(blockchain.chain).not.toEqual(incomingBlockchain.chain);
  });
});
