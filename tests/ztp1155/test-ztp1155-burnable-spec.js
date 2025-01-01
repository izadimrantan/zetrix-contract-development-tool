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

describe('Test contract ztp1155 burnable', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-burnable-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing mint and burn function by same owner', async () => {

        const tokenId = "1";

        console.log('\x1b[36m%s\x1b[0m', "### Minting token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: tokenId,
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress,
                id: tokenId
            }
        });

        expect(resp).to.equal("1000000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Burning token");
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'burn',
            params: {
                from: sourceAddress,
                id: tokenId,
                value: "500000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress,
                id: tokenId
            }
        });

        expect(resp).to.equal("500000000000");
    });

    it('testing mint and burn function by non-approved owner', async () => {

        const tokenId = "2";

        console.log('\x1b[36m%s\x1b[0m', "### Minting token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: tokenId,
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress,
                id: tokenId
            }
        });

        expect(resp).to.equal("1000000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Burning token");
        resp = await invokeContract(sdk, sourceAddress1, privateKey1, contractAddress, {
            method: 'burn',
            params: {
                from: sourceAddress,
                id: tokenId,
                value: "500000000000"
            }
        });

        expect(resp).to.equal(151);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress,
                id: tokenId
            }
        });

        expect(resp).to.equal("1000000000000");
    });

    it('testing mint and burn function by approved owner', async () => {

        const tokenId = "3";

        console.log('\x1b[36m%s\x1b[0m', "### Minting token by " + sourceAddress);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress,
                id: tokenId,
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress,
                id: tokenId
            }
        });

        expect(resp).to.equal("1000000000000");

        console.log('\x1b[36m%s\x1b[0m', "### Setting approval for all from " + sourceAddress + " to " + sourceAddress1);
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'setApprovalForAll',
            params: {
                operator: sourceAddress1,
                approved: true
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting is approved for all");
        resp = await queryContract(sdk, contractAddress, {
            method: 'isApprovedForAll',
            params: {
                owner: sourceAddress,
                operator: sourceAddress1
            }
        });

        expect(resp).to.equal(true);

        console.log('\x1b[36m%s\x1b[0m', "### Burning token by " + sourceAddress1);
        resp = await invokeContract(sdk, sourceAddress1, privateKey1, contractAddress, {
            method: 'burn',
            params: {
                from: sourceAddress,
                id: tokenId,
                value: "500000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress,
                id: tokenId
            }
        });

        expect(resp).to.equal("500000000000");
    });

    it('testing batch mint and batch burn function by non approved owner', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting token by " + sourceAddress);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mintBatch',
            params: {
                to: sourceAddress,
                ids: ["4", "5", "6"],
                values: ["1000000000000", "1000000000000", "1000000000000"]
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOfBatch',
            params: {
                accounts: [sourceAddress, sourceAddress, sourceAddress],
                ids: ["4", "5", "6"]
            }
        });

        expect(resp).to.deep.equal(["1000000000000", "1000000000000", "1000000000000"]);

        console.log('\x1b[36m%s\x1b[0m', "### Setting approval for all from " + sourceAddress + " to " + sourceAddress1);
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'setApprovalForAll',
            params: {
                operator: sourceAddress1,
                approved: false
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting is approved for all");
        resp = await queryContract(sdk, contractAddress, {
            method: 'isApprovedForAll',
            params: {
                owner: sourceAddress,
                operator: sourceAddress1
            }
        });

        expect(resp).to.equal(false);

        console.log('\x1b[36m%s\x1b[0m', "### Burning token by " + sourceAddress1);
        resp = await invokeContract(sdk, sourceAddress1, privateKey1, contractAddress, {
            method: 'burnBatch',
            params: {
                from: sourceAddress,
                ids: ["5", "6"],
                values: ["700000000000", "400000000000"]
            }
        });

        expect(resp).to.equal(151);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance batch of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOfBatch',
            params: {
                accounts: [sourceAddress, sourceAddress, sourceAddress],
                ids: ["4", "5", "6"]
            }
        });

        expect(resp).to.deep.equal(["1000000000000", "1000000000000", "1000000000000"]);
    });

    it('testing batch mint and batch burn function by approved owner', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting token by " + sourceAddress);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mintBatch',
            params: {
                to: sourceAddress,
                ids: ["7", "8", "9"],
                values: ["1000000000000", "1000000000000", "1000000000000"]
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOfBatch',
            params: {
                accounts: [sourceAddress, sourceAddress, sourceAddress],
                ids: ["7", "8", "9"]
            }
        });

        expect(resp).to.deep.equal(["1000000000000", "1000000000000", "1000000000000"]);

        console.log('\x1b[36m%s\x1b[0m', "### Setting approval for all from " + sourceAddress + " to " + sourceAddress1);
        resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'setApprovalForAll',
            params: {
                operator: sourceAddress1,
                approved: true
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting is approved for all");
        resp = await queryContract(sdk, contractAddress, {
            method: 'isApprovedForAll',
            params: {
                owner: sourceAddress,
                operator: sourceAddress1
            }
        });

        expect(resp).to.equal(true);

        console.log('\x1b[36m%s\x1b[0m', "### Burning token by " + sourceAddress1);
        resp = await invokeContract(sdk, sourceAddress1, privateKey1, contractAddress, {
            method: 'burnBatch',
            params: {
                from: sourceAddress,
                ids: ["8", "9"],
                values: ["700000000000", "400000000000"]
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance batch of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOfBatch',
            params: {
                accounts: [sourceAddress, sourceAddress, sourceAddress],
                ids: ["7", "8", "9"]
            }
        });

        expect(resp).to.deep.equal(["1000000000000", "300000000000", "600000000000"]);
    });

});
