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

describe('Test contract ztp1155', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp1155/ztp1155-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing contract info function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting contract info");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'contractInfo'
        });

        expect(resp.name).to.equal("MY 1155");
    });

    [1, 2, 3].forEach(value => {
        it('testing mint function', async () => {

            console.log('\x1b[36m%s\x1b[0m', "### Minting token " + value);
            let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
                method: 'mint',
                params: {
                    to: sourceAddress,
                    id: value.toString(),
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
                account: sourceAddress,
                id: "1"
            }
        });

        expect(resp).to.equal("1000000000000");
    });

    it('testing token uri function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting token uri");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'uri',
            params: {
                id: "1"
            }
        });

        expect(resp).to.equal("https://example.com/1");
    });

    it('testing get is approved for all function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting is approved for all");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'isApprovedForAll',
            params: {
                owner: sourceAddress,
                operator: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi"
            }
        });

        expect(resp).to.equal(false);
    });

    it('testing safe transfer from function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let tokenId = "2";
        let value = "500000000000";

        console.log('\x1b[36m%s\x1b[0m', "### Transferring token " + tokenId + " from " + sourceAddress + " to " + recipient + " with value " + value);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'safeTransferFrom',
            params: {
                from: sourceAddress,
                to: recipient,
                id: tokenId,
                value: value
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting owner of token " + tokenId);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: recipient,
                id: tokenId
            }
        });

        expect(resp).to.equal(value);
    });

    it('testing set approval for all from function', async () => {

        let operator = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";

        console.log('\x1b[36m%s\x1b[0m', "### Setting approval for all from " + sourceAddress + " to " + operator);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'setApprovalForAll',
            params: {
                operator: operator,
                approved: true
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting is approved for all");
        resp = await queryContract(sdk, contractAddress, {
            method: 'isApprovedForAll',
            params: {
                owner: sourceAddress,
                operator: operator
            }
        });

        expect(resp).to.equal(true);
    });

    it('testing burn function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Burning token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'burn',
            params: {
                from: sourceAddress,
                id: "1",
                value: "500000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                account: sourceAddress,
                id: "1"
            }
        });

        expect(resp).to.equal("500000000000");
    });

    it('testing mint batch function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting batch token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mintBatch',
            params: {
                to: sourceAddress,
                ids: ["4", "5", "6"],
                values: ["1000000000000", "1000000000000", "1000000000000"]
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance batch of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOfBatch',
            params: {
                accounts: [sourceAddress, sourceAddress, sourceAddress],
                ids: ["4", "5", "6"]
            }
        });

        expect(resp).to.deep.equal(["1000000000000", "1000000000000", "1000000000000"]);
    })

    it('testing burn batch function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting batch token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'burnBatch',
            params: {
                from: sourceAddress,
                ids: ["5", "6"],
                values: ["700000000000", "400000000000"]
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance batch of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOfBatch',
            params: {
                accounts: [sourceAddress, sourceAddress, sourceAddress],
                ids: ["4", "5", "6"]
            }
        });

        expect(resp).to.deep.equal(["1000000000000", "300000000000", "600000000000"]);
    })

});
