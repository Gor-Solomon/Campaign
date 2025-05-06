const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  'ahead sniff target check sausage under episode again accuse scissors vibrant toss',
  'https://sepolia.infura.io/v3/474d82636563426bb0852fb07325dd32'
);

const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(
      JSON.parse(compiledFactory.interface)
    )
      .deploy({ data: compiledFactory.bytecode })
      .send({ gas: "1000000", from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
  } catch (error) {
    console.error("Deployment failed:", error);
  } finally {
    provider.engine.stop();
  }
};

deploy().catch(error => {
  console.error("Unhandled error in deploy process:", error);
  provider.engine.stop();
  process.exit(1);
});