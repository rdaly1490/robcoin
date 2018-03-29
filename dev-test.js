const Block = require("./block");

const block = new Block("foo", "bar", "zoo", "baz");

const fooBlock = Block.mineBlock(Block.genesis(), "foo");
console.log(fooBlock.toString());
