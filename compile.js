// compile code will go here
//fill this file after we install solc using NPM
const path = require('path'); //cross platform compatibility guaranteed lol
const fs = require('fs');
const solc = require('solc');


const lotterypath = path.resolve(__dirname, 'contracts', 'Lottery.sol'); //navigate us from root to project folder
const source = fs.readFileSync(lotterypath, 'utf8');

//compile statement:
//result = solc.compile(source, 1); // number of contracts we want to compile
//console.log(result);

module.exports = solc.compile(source,1).contracts[':Lottery']; //so we only return inbox contract, instead of big chunk of processes
// save it in module.exports
