const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });
    //test enter function
    it('allow one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(1, players.length);
    });
    it('allow >1 accounts', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value : web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value : web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[3],
            value : web3.utils.toWei('0.02', 'ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(accounts[3],players[3]);
        assert.equal(4, players.length);
    });
    it('check only allow certain ammount of money to enter', async () => {
        try{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: 10
        });
        assert(false);
    } catch(err){
        assert(err);
    }
    });
    //testing modifiers
    it('check only admin who can trig pick winner', async () => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch(err){
            assert(err);
        }
    });
    // end to end testing
    it('send money and reset', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value : web3.utils.toWei('2', 'ether')
        });
        
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        //pick winner
        await lottery.methods.pickWinner().send({from: accounts[0]});

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        // init and final difference should be a bit less 2 ether

        const diff = finalBalance-initialBalance;

        console.log('difference: ');
        console.log(diff);

        assert( diff > web3.utils.toWei('1.8','ether'));

    });
});


