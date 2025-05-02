import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xAe2Fd6EbAD8021B3D2C82065B292Cc248A4584F7'
);

export default instance;