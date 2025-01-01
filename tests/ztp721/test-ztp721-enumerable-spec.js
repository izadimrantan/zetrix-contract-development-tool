const ZtxChainSDK = require('zetrix-sdk-nodejs');
const expect = require('chai').expect;
const BigNumber = require('bignumber.js');
const sleep = require("../../utils/delay");
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
let contractAddress = process.env.SPEC_ZTP721_ENUMERABLE;

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract ztp72 enumerable', function () {
    this.timeout(30000);

    before(async function () {
        let contractName = 'specs/ztp721/ztp721-enumerable-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    [1, 2, 3].forEach(value => {
        it('testing mint function', async () => {

            console.log('\x1b[36m%s\x1b[0m', "### Minting token " + value);
            let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
                method: 'mint',
                params: {
                    to: sourceAddress
                }
            });

            expect(resp).to.equal(0);
        })
    });

    it('testing token of owner by index function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Get token of owner by index");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'tokenOfOwnerByIndex',
            params: {
                index: 2,
                owner: sourceAddress
            }
        });

        expect(parseInt(resp)).to.greaterThanOrEqual(1);
    });

    it('testing total supply function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Get total supply");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'totalSupply'
        });

        expect(parseInt(resp)).to.greaterThanOrEqual(3);
    });

    it('testing token by index function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Get token by index");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'tokenByIndex',
            params: {
                index: 2
            }
        });
        expect(parseInt(resp)).to.greaterThanOrEqual(1);
    });

});
