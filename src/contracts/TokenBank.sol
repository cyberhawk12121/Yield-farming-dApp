pragma solidity ^0.5.0;


import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenBank{
    string public name= "Dapp Bank";
    address public owner;

    DappToken public dappToken;
    DaiToken public daiToken;

    // Map to take note of the flow of money in the contract
    mapping(address=>uint) public   depositedAmt;
    // If the user has deposited
    mapping(address=>bool)  public Hasdeposited;
    mapping(address=>bool)  public isDepositing;
    // account of all who have deposited
    address[] public depositers;

    // Get reference of Dapp and Dai token on the network
    constructor(DappToken _dappToken, DaiToken _daiToken)public{
        daiToken= _daiToken;
        dappToken= _dappToken;
        owner= msg.sender;
    }

    // It's public so that anybody can add tokens in the smart contract
    function deposit(uint amt) public{
        require(amt>0, "Amount cannot be smaller than 0");

        // Adding token to this smart contract using transfer() function
        // transferFrom() allows third party (like this smart contract) to send tokens on behalf of the user
        daiToken.transferFrom(msg.sender, address(this), amt);  // takes (sender, receiver, amount)
        // address(this) means address of "this" smart contract

        // Update deposited balance
        depositedAmt[msg.sender] += amt;    // Number (uint) corresponding to that address (the person who called the function) has been increased by amt.

        // To prevent double counting of depositers we'll use the map and if their name is present in it we'll not add them in the depositors list (Cuz then we might issue them tokens multiple times)
        if(!Hasdeposited[msg.sender]){
            depositers.push(msg.sender);
        }

        isDepositing[msg.sender]= true;
        Hasdeposited[msg.sender]= true;
    }   // end deposit()

    function issueTokens() public{
        require(msg.sender==owner, "caller must be the owner" );
        for(uint i=0; i<depositers.length; i++){
            address recipient=depositers[i];
            uint balance= depositedAmt[recipient];
            // Reward them as much Dapp tokens as the number of Dai tokens they've deposited 
            if(balance>0){
                dappToken.transfer(recipient, balance);
            }
        }
    }   // end issueTokens()


    function withdraw() public{
        uint balance= depositedAmt[msg.sender];
        require(balance>0, "Deposited amount cannot be 0");

        daiToken.transfer(msg.sender, balance);

        // Update the depositors the status
        depositedAmt[msg.sender]= 0;
        isDepositing[msg.sender]=false;
    }

}   // end contract
