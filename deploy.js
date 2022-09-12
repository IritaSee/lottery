// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode } =  require('./compile');

const provider = new HDWalletProvider(
    'current food teach radio vital silver gallery strategy present giraffe civil symbol',
    'https://rinkeby.infura.io/v3/a26c54bafa0045549128ff679b366ca6'
);

const web3 = new Web3(provider);

const deploy = async() => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({gas: '1000000', from: accounts[0]});

    console.log('contract deployed to:', result.options.address);
    provider.engine.stop();
};
deploy();