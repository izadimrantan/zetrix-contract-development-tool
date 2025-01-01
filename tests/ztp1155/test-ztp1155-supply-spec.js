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

describe('Test contract ztp1155 supply', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-supply-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing total supply function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting token 1 value 1000000000000");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: '1',
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Minting token 1 value 200000000000");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: '1',
                value: "200000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Minting token 2 value 500000000000");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: '2',
                value: "500000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting total supply token 1");
        resp = await queryContract(sdk, contractAddress, {
            method: 'totalSupply',
            params: {
                id: "1"
            }
        });

        expect(resp).to.equal("1200000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Getting total supply token 2");
        resp = await queryContract(sdk, contractAddress, {
            method: 'totalSupply',
            params: {
                id: "2"
            }
        });

        expect(resp).to.equal("500000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Getting total supply token all");
        resp = await queryContract(sdk, contractAddress, {
            method: 'totalSupply'
        });

        expect(resp).to.equal("1700000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Check if token 1 exist");
        resp = await queryContract(sdk, contractAddress, {
            method: 'exist',
            params: {
                id: "1"
            }
        });

        expect(resp).to.equal(true);

        console.log('\x1b[36m%s\x1b[0m', "### Burn token 1 value 400000000000");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'burn',
            params: {
                from: sourceAddress,
                id: '1',
                value: "400000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting total supply token 1 after burn");
        resp = await queryContract(sdk, contractAddress, {
            method: 'totalSupply',
            params: {
                id: "1"
            }
        });

        expect(resp).to.equal("800000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Getting total supply token all after burn");
        resp = await queryContract(sdk, contractAddress, {
            method: 'totalSupply'
        });

        expect(resp).to.equal("1300000000000");


    });


});
