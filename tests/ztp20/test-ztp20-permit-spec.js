const ZtxChainSDK = require('zetrix-sdk-nodejs');
const expect = require('chai').expect;
const queryContract = require("../../utils/query-contract");
const invokeContract = require("../../utils/invoke-contract");
const deployOperation = require("../../scripts/deploy-operation");
require('dotenv').config({path: "/../.env"})
require('mocha-generators').install();
const crypto = require('crypto');
const signData = require("../../utils/sign-data");

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

function generateHash(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

describe('Test contract ztp20 permit', function () {
    this.timeout(100000);

    before(async function () {
        let contractName = 'specs/ztp20/ztp20-permit-spec.js'
        let input = {};
        contractAddress = await deployOperation(process.env.NODE_URL, sourceAddress, privateKey, contractName, input);
        console.log('\x1b[36m%s\x1b[0m', "### Running test on contract address: ", contractAddress);
    });

    it('testing mint, approve by permit and check allowance', async () => {

        console.log('\x1b[36m%s\x1b[0m', "### Minting token");
        let resp = await invokeContract(sdk, sourceAddress, privateKey, contractAddress, {
            method: 'mint',
            params: {
                account: sourceAddress,
                value: "1000000000000"
            }
        });

        expect(resp).to.equal(0);

        console.log('\x1b[36m%s\x1b[0m', "### Query nonce of " + sourceAddress);
        resp = await queryContract(sdk, contractAddress, {
            method: 'nonces',
            params: {
                owner: sourceAddress
            }
        });

        expect(resp).to.equal("0");
        const nonce = resp;
        const deadline = "1756363348000000";
        const value = "500000000000";

        const PERMIT_TYPEHASH = generateHash("Permit(owner,spender,value,deadline,p,s)");
        const data = PERMIT_TYPEHASH + sourceAddress + sourceAddress1 + value + nonce.toString() + deadline;
        const hash = generateHash(data);
        const signedHash = await signData(sdk, privateKey, hash);

        console.log('\x1b[36m%s\x1b[0m', "### Permit approve function invoked by spender");
        resp = await invokeContract(sdk, sourceAddress1, privateKey1, contractAddress, {
            method: 'permit',
            params: {
                owner: sourceAddress,
                spender: sourceAddress1,
                value: value,
                deadline: deadline,
                p: signedHash[0].publicKey,
                s: signedHash[0].signData
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
    });

});
