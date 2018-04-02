const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("../robcoin/blockchain");
const P2pServer = require("./p2p-server");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain);

app.use(bodyParser.json());

// The first node will create the P2P websocket server
// Later nodes will connect to this server

app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/mine", (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();

  // return the updated chain to the miner
  res.redirect("/blocks");
});

app.listen(HTTP_PORT, () => {
  console.log(`Listening on port ${HTTP_PORT}`);
});

p2pServer.listen();
