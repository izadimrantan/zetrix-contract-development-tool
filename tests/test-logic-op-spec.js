const ZtxChainSDK = require('zetrix-sdk-nodejs');
const expect = require('chai').expect;
const BigNumber = require('bignumber.js');
const sleep = require("../utils/delay");
const queryContract = require("../utils/query-contract");
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
const contractAddress = process.env.SPEC_LOGIC_OP;

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract logic operation', function () {
    this.timeout(30000);

    it('testing bitwiseAnd function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'bitwiseAnd',
            params: {
                a: "24", // 11000
                b: "20"  // 10100
            }
        });

        expect(resp.data).to.equal("16") // 10000
    });

    it('testing bitwiseOr function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'bitwiseOr',
            params: {
                a: "24", // 11000
                b: "20"  // 10100
            }
        });

        expect(resp.data).to.equal("28") // 11100
    });

    it('testing leftShift function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'leftShift',
            params: {
                value: "24", // 00011000
                shiftBy: "2"
            }
        });

        expect(resp.data).to.equal("96") // 01100000
    });

    it('testing rightShift function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'rightShift',
            params: {
                value: "24", // 00011000
                shiftBy: "2"
            }
        });

        expect(resp.data).to.equal("6") // 00000110
    });

});
