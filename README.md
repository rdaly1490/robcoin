# RobCoin
Building a cryptocurrency

### To Use (Have a few terminal tabs open)
1. `npm run dev` in the first one
2. Something like `HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev` and `HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev` in tabs 1,2, etc., incrementing the port numbers and adding peers in each tab.
3. Use Postman to POST /mine endpoint with a data body param in whatever port instance you want.
4. You can see this block in GET /blocks for the other ports
5. You can also add transactions and use /mine-transactions to add a block.  Try adding transactions from some of the other ports and mining on 3001 and verifying the block is added to the blockchain at /blocks.

### Future Considerations/ TODO's
1. Have the clear transactions method only clear a subset and not the entire pool.
2. Implement transaction fees that are used as part of a miner's reward.
3. Make the blockchain's reward wallet inaccessible to others.
4. Build a basic frontend or maybe electron desktop app for the wallet, etc.
5. Make an index folder in each dir to import/export all required files.