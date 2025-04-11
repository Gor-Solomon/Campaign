const assert = require('assert');
const ganache = require('ganache');
const { Web3, ERR_TX } = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');  // Looks like you swapped these
const compiledCampaign = require('../ethereum/build/Campaign.json');        // Looks like you swapped these
const { describe, it } = require('mocha');
const { error } = require('console');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    // This line needs the 'new' keyword
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = deployedCampaigns[0];

    // Don't call() here - it's for reading data, not initializing the contract
    campaign = new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {  // Fixed spelling
    it('Deploys a factory and a campaign', () => {  // Fixed spelling
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Marks caller as the campagin manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('Allows people to donate money and markes them as approvers', async () => {
        await campaign.methods.contribute().send({ value: '200', from: accounts[1] });
        const approver = await campaign.methods.approvers(accounts[1]).call();

        assert(approver);
    });

    it("requires a minimum contribution", async () => {
        try {
          await campaign.methods.contribute().send({
            value: "5000",
            from: accounts[1]
          });
          assert(false);
        } catch (err) {
          assert(err);
        }
      });

    
    it('Allows a manager to make a payment request', async () => {
        
        await campaign.methods.createRequest('Buy battery', 100, accounts[1]).send({ gas: '1000000', from: accounts[0] });

        const request = await campaign.methods.requests(0).call();

        assert.equal('Buy battery', request.description);

    });

    it('Processes Request', async () => {
        
        // Contribute
        await campaign.methods.contribute().send({value: 100000001, from: accounts[1]});
        await campaign.methods.contribute().send({value: 100000001, from: accounts[2]});
        await campaign.methods.contribute().send({value: 100000001, from: accounts[3]});

        // Create a Request
        await campaign.methods.createRequest('Buy 30 Transastors A34', 150000004, accounts[4])
                              .send({gas: '1000000', from: accounts[0]});


        // Approve requests
        await campaign.methods.approveRequest(0).send({ gas: '1000000', from: accounts[1]});
        await campaign.methods.approveRequest(0).send({ gas: '1000000', from: accounts[2]});
        await campaign.methods.approveRequest(0).send({ gas: '1000000', from: accounts[3]});

        // Initial balance
        const initialBalance = await web3.eth.getBalance(accounts[4]);

        //Finelize A Request
        await campaign.methods.finalizeRequest(0).send({gas: '1000000', from: accounts[0]});

        //Check balance
        const postBalance = await web3.eth.getBalance(accounts[4]);

        assert(postBalance > initialBalance);
    });
});