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

describe('Test contract ztp20', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp20/ztp20-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing contract info function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting contract info");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'contractInfo'
        });

        expect(resp.name).to.equal("MY TOKEN");
    });

    [1, 2, 3].forEach(value => {
        it('testing mint function', async () => {

            console.log('\x1b[36m%s\x1b[0m', "### Minting token count " + value);
            let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
                method: 'mint',
                params: {
                    account: sourceAddress,
                    value: "1000000000000"
                }
            });

            expect(resp).to.equal(0);
        })
    });

    it('testing get balance of function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        let resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress
            }
        });

        expect(resp).to.equal("3000000000000");
    });

    it('testing transfer function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let value = "500000000000";

        console.log('\x1b[36m%s\x1b[0m', "### Transferring token from " + sourceAddress + " to " + recipient + " with value " + value);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'transfer',
            params: {
                to: recipient,
                value: value
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

        expect(resp).to.equal("2500000000000");
    });

    it('testing approve and allowance function', async () => {

        let spender = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";

        console.log('\x1b[36m%s\x1b[0m', "### Setting approval from " + sourceAddress + " to " + spender);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'approve',
            params: {
                spender: spender,
                value: "500000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting allowance from " + sourceAddress + " to " + spender);
        resp = await queryContract(sdk, contractAddress, {
            method: 'allowance',
            params: {
                owner: sourceAddress,
                spender: spender
            }
        });

        expect(resp).to.equal("500000000000");
    });

    it('testing transfer from function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let value = "500000000000";

        console.log('\x1b[36m%s\x1b[0m', "### Transferring token from " + sourceAddress + " to " + recipient + " with value " + value);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'transferFrom',
            params: {
                from: sourceAddress,
                to: recipient,
                value: value
            }
        });

        expect(resp).to.equal(151); // Must be error because we don't use the recipient private key to invoke tx

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + recipient);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: recipient
            }
        });

        expect(resp).to.equal("500000000000"); // Recipient balance remain as before
    });

    it('testing burn function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Burning token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
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

        expect(resp).to.equal("2000000000000");
    });

});
