const ZtxChainSDK = require('zetrix-sdk-nodejs');
const expect = require('chai').expect;
const BigNumber = require('bignumber.js');
const sleep = require("../../utils/delay");
const queryContract = require("../../utils/query-contract");
const invokeContract = require("../../utils/invoke-contract");
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
const contractAddress = process.env.SPEC_ZTP721_PAUSE;

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract ztp72 pausable', function () {
    this.timeout(30000);

    xit('testing contract info function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'contractInfo'
        });

        expect(resp.name).to.equal("MY NFT");
    });

    it('testing mint function', async () => {

        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                to: sourceAddress
            }
        });

        expect(resp).not.to.be.null;
    });

    xit('testing token uri function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'tokenURI',
            params: {
                tokenId: "1"
            }
        });

        expect(resp.uri).to.equal("https://example-enum.com/1");
    });

    xit('testing approve function', async () => {

        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'approve',
            params: {
                to: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi",
                tokenId: "1"
            }
        });

        expect(resp).not.to.be.null;
    });

    xit('testing get approved function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'getApproved',
            params: {
                tokenId: "1"
            }
        });

        expect(resp).to.equal("ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi");
    });

    xit('testing get is approved for all function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'isApprovedForAll',
            params: {
                owner: sourceAddress,
                operator: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi"
            }
        });

        expect(resp).to.equal(false);
    });

    xit('testing get balance of function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'balanceOf',
            params: {
                owner: sourceAddress
            }
        });

        expect(parseInt(resp)).to.greaterThanOrEqual(1);
    });

    xit('testing get owner of function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'ownerOf',
            params: {
                tokenId: "1"
            }
        });

        expect(resp).to.equal(sourceAddress);
    });

    xit('testing get name function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'name'
        });

        expect(resp).to.equal("MY NFT");
    });

    xit('testing get symbol function', async () => {

        let resp = await queryContract(sdk, contractAddress, {
            method: 'symbol'
        });

        expect(resp).to.equal("myNFT");
    });

    xit('testing safe transfer from function', async () => {

        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'safeTransferFrom',
            params: {
                from: sourceAddress,
                to: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi",
                tokenId: "1"
            }
        });

        expect(resp).not.to.be.null;
    });

    xit('testing transfer from function', async () => {

        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'transferFrom',
            params: {
                from: sourceAddress,
                to: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi",
                tokenId: "1"
            }
        });

        expect(resp).not.to.be.null;
    });

    xit('testing set approval for all from function', async () => {

        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'setApprovalForAll',
            params: {
                operator: "ZTX3PU7vzzsaWEocrcau4jwjpMKjwK2tbnjWi",
                approved: true
            }
        });

        expect(resp).not.to.be.null;
    });

    xit('testing burn function', async () => {

        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'burn',
            params: {
                tokenId: "2"
            }
        });

        expect(resp).not.to.be.null;
    });

    xit('testing pause function', async () => {

        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'pause'
        });

        expect(resp).not.to.be.null;
    });

    xit('testing unpause function', async () => {

        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'unpause'
        });

        expect(resp).not.to.be.null;
    });

});
