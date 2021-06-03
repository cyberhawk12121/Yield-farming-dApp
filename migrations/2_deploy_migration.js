const DappToken= artifacts.require('DappToken');
const DaiToken= artifacts.require('DaiToken');
const TokenBank= artifacts.require('TokenBank');

// YOU CAN WRITE ALL THIS DIRECTLY IN TRUFFLE CONSOLE

module.exports= async function(deployer, network, accounts){
    //deploy DAI token
    await deployer.deploy(DaiToken);
    const daiToken=await DaiToken.deployed()

    // deploy DAPP token
    await deployer.deploy(DappToken);
    const dappToken= await DaiToken.deployed()

    await deployer.deploy(TokenBank, dappToken.address, daiToken.address)
    const tokenBank= await TokenBank.deployed()


    // Transfer all tokens to the smart contract
    await dappToken.transfer(tokenBank.address,'100000000000000000000000')

    // transfer 100 to the investors account (To play with our app)
    // This account[1] is the second Ganache account
    await daiToken.transfer(accounts[1],'100000000000000000000')
}