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

const privateKey1 = "privBrr7fmQiMJXCtW7GXb4qoU393w12TBqm5WUvid2h5LgULpTRo5rX";
const sourceAddress1 = "ZTX3M6pWnCXk4e6vrXu4SQQganjQJrrF8Xezx";

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

describe('Test contract ztp20 burnable', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp20/ztp20-burnable-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing mint and burn function by same owner', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                account: sourceAddress,
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress
            }
        });

        expect(resp).to.equal("1000000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Burning token");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'burn',
            params: {
                account: sourceAddress,
                value: "500000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress
            }
        });

        expect(resp).to.equal("500000000000");
    });

    it('testing mint and burn from function by approved owner', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                account: sourceAddress,
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Setting approval from " + sourceAddress + " to " + sourceAddress1);
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'approve',
            params: {
                spender: sourceAddress1,
                value: "500000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting allowance of " + sourceAddress1);
        resp = await queryContract(sdk, contractAddress, {
            method: 'allowance',
            params: {
                owner: sourceAddress,
                spender: sourceAddress1
            }
        });

        expect(resp).to.equal("500000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Burning token from " + sourceAddress + " by " + sourceAddress1);
        resp = await invokeContract(sdk, sourceAddress1, privateKey1, contractAddress, {
            method: 'burnFrom',
            params: {
                account: sourceAddress,
                value: "300000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting allowance of " + sourceAddress1);
        resp = await queryContract(sdk, contractAddress, {
            method: 'allowance',
            params: {
                owner: sourceAddress,
                spender: sourceAddress1
            }
        });

        expect(resp).to.equal("200000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress
            }
        });

        expect(resp).to.equal("700000000000");
    });

});
