const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain/blockchain");
const P2pServer = require("./p2p-server");

const Wallet = require("../wallet/wallet");
const TransactionPool = require("../wallet/transaction-pool");
const Miner = require("./miner");

const PORT = process.env.PORT || 3001;

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet();
const pool = new TransactionPool();
const p2pServer = new P2pServer(blockchain, pool);
const miner = new Miner(blockchain, pool, wallet, p2pServer);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// The first node will create the P2P websocket server
// Later nodes will connect to this server

app.get("/", (req, res) => {
  res.send("<h1>RobCoin Server Up and Running<h1>");
});

app.get("/peers", (req, res) => {
  res.json({ sockets: p2pServer.sockets });
});

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.get("/transactions", (req, res) => {
  res.json(pool.transactions);
});

app.get("/mine-transactions", (req, res) => {
  const block = miner.mine();
  console.log(`A new block has been added: ${block}`);
  res.redirect("/blocks");
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get("/balance", (req, res) => {
  res.json({ balance: wallet.balance });
});

app.post("/mine", (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  // return the updated chain to the miner
  res.redirect("/blocks");
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(
    recipient,
    amount,
    blockchain,
    pool
  );
  console.log(`New transaction added to pool: ${transaction.toString()}`);

  p2pServer.broadcastTransaction(transaction);

  res.redirect("/transactions");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

p2pServer.listen();
