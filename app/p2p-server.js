const Websocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5001;
// PEERS env var is a string of all peers comma delimited
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    // Fires whenever new socket connects to this server
    server.on("connection", socket => this.connectSocket(socket));

    this.connectToPeers();

    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log("Socket Connected");

    this.messageHandler(socket);
    this.sendChain(socket);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  messageHandler(socket) {
    socket.on("message", message => {
      const data = JSON.parse(message);
      console.log(data);

      this.blockchain.replaceChain(data);
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }
}

module.exports = P2pServer;
