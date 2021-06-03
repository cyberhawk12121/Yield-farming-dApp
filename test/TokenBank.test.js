const { assert } = require('chai');

const DaiToken= artifacts.require('DaiToken');
const DappToken= artifacts.require('DappToken');
const TokenBank= artifacts.require('TokenBank');

require('chai')
    .use(require('chai-as-promised'))
    .should()


function tokens(n) {
    return web3.utils.toWei(n, 'ether');
    }

contract('TokenBank', ([owner, investor]) =>{
    let daiToken, dappToken, tokenBank
    before(async () => {
        // Load Contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenBank = await TokenBank.new(dappToken.address, daiToken.address)
     
        // Transfer all Dapp tokens to farm (1 million)
        await dappToken.transfer(tokenBank.address, tokens('1000000'))
    
        // Send tokens to investor
        await daiToken.transfer(investor, tokens('100'), { from: owner })
      })

    // Write tests here
    describe("Mock DAI deployment", async()=>{
        it('has a name', async()=>{
            let daiToken= await DaiToken.new()
            const name= await daiToken.name()   // Actually DaiToken name returns "Mock Dai Token" (Check the contract)
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe("Mock DAPP deployment", async()=>{
        it('has a name', async()=>{
            let dappToken= await DappToken.new()
            const name= await dappToken.name()   // Actually DaiToken name returns "Mock Dai Token" (Check the contract)
            assert.equal(name, 'Mock DAPP Token')
        })
    })

    describe("Token Bank", async()=>{
        it('has a name', async()=>{
            let tokenBank= await TokenBank.new()
            const name= await tokenBank.name()   // Actually DaiToken name returns "Mock Dai Token" (Check the contract)
            assert.equal(name, 'Dapp Bank')
        })
        it('contract has tokens', async()=>{
            let balance= await dappToken.balanceOf(tokenBank.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe("Farming Tokens", async()=>{
        it('rewards investors for depositing mDAI tokens', async()=>{
            let result;
            result=await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor mock DAI wallet balance correct before depositing')

            result=await daiToken.balanceOf(tokenBank.address)
            assert.equal(result.toString(), tokens('100'), 'Token Bank mock DAI wallet balance correct after depositing')

            result=await tokenBank.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor depositing balance after depositing')

            result=await tokenBank.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')
            
            await daiToken.approve(tokenBank.address, tokens('100'), {from: investor})
            await tokenBank.deposit(tokens('100'), {from:investor})
        
            //Issue tokens
            await tokenBank.issueTokens({from:owner})
            // check balances after issue
            result=await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

            await tokenBank.issueTokens({from: investor}).should.be.rejected;
        })
    })
})