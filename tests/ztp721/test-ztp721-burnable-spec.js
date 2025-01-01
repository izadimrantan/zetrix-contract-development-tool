const ZtxChainSDK = require('zetrix-sdk-nodejs');
const expect = require('chai').expect;
const queryContract = require("../../utils/query-contract");
const invokeContract = require("../../utils/invoke-contract");
const deployOperation = require("../../scripts/deploy-operation");
require('dotenv').config({path: "/../.env"})
require('mocha-generators').install();

/*
 Specify the zetrix address and private key
 */
const privateKey = process.env.PRIVATE_KEY;
const sourceAddress = process.env.ZTX_ADDRESS;

/*
 Specify the smart contract address
 */
let contractAddress = process.env.SPEC_ZTP721_BURNABLE;

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract ztp72 burnable', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp721/ztp721-burnable-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing mint and burn function by same owner', async () => {

        let tokenId = "1";

        console.log('\x1b[36m%s\x1b[0m', "### Minting token " + tokenId);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Burning token " + tokenId);
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'burn',
            params: {
                tokenId: tokenId
            }
        });

        expect(resp).to.equal(0);
    });

    it('testing mint and burn function by different owner', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let tokenId = "2";

        console.log('\x1b[36m%s\x1b[0m', "### Minting token " + tokenId + " to " + sourceAddress);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Transferring token " + tokenId + " from " + sourceAddress + " to " + recipient);
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'transferFrom',
            params: {
                from: sourceAddress,
                to: recipient,
                tokenId: tokenId
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Burning token " + tokenId);
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'burn',
            params: {
                tokenId: tokenId
            }
        });

        expect(resp).to.equal(151);
    });

});
