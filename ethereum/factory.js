import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x75845cC6b2760E636c980056007c6B9c05B2E31C'
);

export default instance;