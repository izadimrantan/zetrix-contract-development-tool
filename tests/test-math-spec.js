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
const contractAddress = process.env.SPEC_MATH;

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract math', function () {
    this.timeout(30000);

    it('testing pow function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'pow',
            params: {
                base: "10",
                exp: "2"
            }
        });

        expect(resp.data).to.equal("100");
    });

    it('testing sqrt function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'sqrt',
            params: {
                x: "144"
            }
        });

        expect(resp.data).to.equal("12");
    });

    it('testing min function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'min',
            params: {
                x: "144",
                y: "122"
            }
        });

        expect(resp.data).to.equal("122");
    });

    it('testing max function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'max',
            params: {
                x: "144",
                y: "122"
            }
        });

        expect(resp.data).to.equal("144");
    });

});
