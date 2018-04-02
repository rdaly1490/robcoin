const DIFFICULTY = 3; // Number of leading 0's a valid hash must have.
const MINE_RATE = 3000; // Time in ms we want blocks to be mined at.  Used to adjust difficulty.
const INITIAL_BALANCE = 500; // since this is for the lulz, give everyone some currency to allow transactions right off the bat

module.exports = { DIFFICULTY, MINE_RATE, INITIAL_BALANCE };
