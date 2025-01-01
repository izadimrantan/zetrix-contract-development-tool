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
let contractAddress = "";

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract ztp1155 pausable', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-pausable-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing mint function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: '1',
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);
    });

    it('testing pause function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Pausing contract");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'pause'
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Trying to mint token after pausing");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: '2',
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(151);
    });

    it('testing unpause function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Unpausing contract");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'unpause'
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Trying to mint token after unpausing");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: '2',
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);
    });

});
