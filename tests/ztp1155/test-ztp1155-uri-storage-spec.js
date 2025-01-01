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

describe('Test contract ztp1155 uri storage', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-uri-storage-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing set token uri and base uri function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting token uri");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'uri',
            params: {
                id: "1"
            }
        });

        expect(resp).to.equal("https://example.com/1");

        console.log('\x1b[36m%s\x1b[0m', "### Set token uri");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'setURI',
            params: {
                id: '1',
                tokenURI: "token1555/token1.json"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Set base uri");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'setBaseURI',
            params: {
                baseURI: 'https://zetrix.io/'
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting token uri after setting base uri and token uri");
        resp = await queryContract(sdk, contractAddress, {
            method: 'uri',
            params: {
                id: "1"
            }
        });

        expect(resp).to.equal("https://zetrix.io/token1555/token1.json");

    });
});
