pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players;

    function Lottery() public{
        manager = msg.sender; //msg works in every part of the contract (global)
        //below is a dnynamic array example
        }

    function enter() public payable{//payable artinya masuk bayar
         //
         require(msg.value >= .01 ether); //0.01 ether = berapa triliun wei gitu, kalo gak ada satuannya, defaultnya wei
         
         players.push(msg.sender);
    }

    function random() private view returns (uint) {
        // there is NO random number generator built in solidity!
        // input: current block difficulity, time, player's address, 
        // process: sha3 algorithm
        // output: big number, 
       return uint(sha3(block.difficulty,now, players));
        
    }

    function pickWinner() public restricted {
        //manager require function:
         // require(msg.sender == manager); // we have the restricted thing
        
        // random() mod players.length = winner
        uint winnerIndex = random() % players.length;
        // send winner some money
        players[winnerIndex].transfer(this.balance);
        //reset contract -> empty list of players, get ready for next round
        players = new address[](0);

    }

    function getPlayers() public view returns (address[]) {
        return players;
    }


   modifier restricted() {
    require(msg.sender == manager);
    _; // means plug-able to the main code, will plugged before the actual function
   }
}