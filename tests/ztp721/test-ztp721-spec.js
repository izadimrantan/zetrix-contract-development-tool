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
let contractAddress = process.env.SPEC_ZTP721;

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract ztp721', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp721/ztp721-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing contract info function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting contract info");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'contractInfo'
        });

        expect(resp.name).to.equal("MY NFT");
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

    it('testing token uri function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting token uri");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'tokenURI',
            params: {
                tokenId: "1"
            }
        });

        expect(resp.uri).to.equal("https://example.com/1");
    });

    it('testing approve function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Approving token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'approve',
            params: {
                to: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi",
                tokenId: "1"
            }
        });

        expect(resp).to.equal(0);
    });

    it('testing get approved function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting approved token");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'getApproved',
            params: {
                tokenId: "1"
            }
        });

        expect(resp).to.equal("ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi");
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

    it('testing get balance of function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting balance of " + sourceAddress);
        let resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                owner: sourceAddress
            }
        });

        expect(parseInt(resp)).to.greaterThanOrEqual(1);
    });

    it('testing get owner of function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting owner of token");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'ownerOf',
            params: {
                tokenId: "1"
            }
        });

        expect(resp).to.equal(sourceAddress);
    });

    it('testing get name function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting name");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'name'
        });

        expect(resp).to.equal("MY NFT");
    });

    it('testing get symbol function', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Getting symbol");
        let resp = await queryContract(sdk, contractAddress, {
            method: 'symbol'
        });

        expect(resp).to.equal("myNFT");
    });

    it('testing safe transfer from function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let tokenId = "1";

        console.log('\x1b[36m%s\x1b[0m', "### Transferring token " + tokenId + " from " + sourceAddress + " to " + recipient);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'safeTransferFrom',
            params: {
                from: sourceAddress,
                to: recipient,
                tokenId: tokenId
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting owner of token " + tokenId);
        resp = await queryContract(sdk, contractAddress, {
            method: 'ownerOf',
            params: {
                tokenId: tokenId
            }
        });

        expect(resp).to.equal("ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi");
    });

    it('testing transfer from function', async () => {

        let recipient = "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi";
        let tokenId = "2";

        console.log('\x1b[36m%s\x1b[0m', "### Transferring token " + tokenId + " from " + sourceAddress + " to " + recipient);
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'transferFrom',
            params: {
                from: sourceAddress,
                to: recipient,
                tokenId: tokenId
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Getting owner of token " + tokenId);
        resp = await queryContract(sdk, contractAddress, {
            method: 'ownerOf',
            params: {
                tokenId: tokenId
            }
        });

        expect(resp).to.equal(recipient);
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
                tokenId: "2"
            }
        });

        expect(resp).to.equal(0);
    });

});
