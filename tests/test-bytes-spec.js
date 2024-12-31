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
const contractAddress = process.env.SPEC_BYTES;

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract bytes', function () {
    this.timeout(30000);

    it('testing num2bin function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'num2bin',
            params: {
                num: 10,
                length: "4"
            }
        });

        expect(resp.data).to.equal("1010")
    });

    it('testing num2bin function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'num2bin',
            params: {
                num: "10",
                length: "4"
            }
        });

        expect(resp.data).to.equal("0010")
    });

    it('testing reverseBytes function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'reverseBytes',
            params: {
                binaryStr: "1110000001100100",
                length: "8"
            }
        });

        expect(resp.data).to.equal("0110010011100000")
    });

    it('testing reverseBytes function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'reverseBytes',
            params: {
                binaryStr: "001110000001100100",
                length: "6"
            }
        });

        expect(resp.data).to.equal("01000000011000001110")
    });

});
