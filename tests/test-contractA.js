const ZtxChainSDK = require('zetrix-sdk-nodejs');
const expect = require('chai').expect;
const BigNumber = require('bignumber.js');
const sleep = require("../utils/delay");
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
const contractAddress = process.env.WZTX;

/*
 Specify the Zetrix Node url
 */
const sdk = new ZtxChainSDK({
    host: process.env.NODE_URL,
    secure: true
});

describe('Test contract wztx', function () {
    this.timeout(30000);

    xit('testing deposit function', function* () {

        const nonceResult = yield sdk.account.getNonce(sourceAddress);

        expect(nonceResult.errorCode).to.equal(0)

        let nonce = nonceResult.result.nonce;
        nonce = new BigNumber(nonce).plus(1).toString(10);

        /*
         Specify the input parameters for invoking contract
         */
        let input = {
            "method": "deposit"
        }

        let contractInvoke = yield sdk.operation.contractInvokeByGasOperation({
            contractAddress,
            sourceAddress,
            gasAmount: '1000',
            input: JSON.stringify(input),
        });

        console.log(contractInvoke)

        expect(contractInvoke.errorCode).to.equal(0)

        const operationItem = contractInvoke.result.operation;

        console.log(operationItem)

        let feeData = yield sdk.transaction.evaluateFee({
            sourceAddress,
            nonce,
            operations: [operationItem],
            signtureNumber: '100',
        });
        console.log(feeData)
        expect(feeData.errorCode).to.equal(0)

        let feeLimit = feeData.result.feeLimit;
        let gasPrice = feeData.result.gasPrice;

        console.log("gasPrice", gasPrice);
        console.log("feeLimit", feeLimit);

        const blobInfo = sdk.transaction.buildBlob({
            sourceAddress: sourceAddress,
            gasPrice: gasPrice,
            feeLimit: feeLimit,
            nonce: nonce,
            operations: [operationItem],
        });

        console.log(blobInfo);
        expect(blobInfo.errorCode).to.equal(0)

        const signed = sdk.transaction.sign({
            privateKeys: [privateKey],
            blob: blobInfo.result.transactionBlob
        })

        console.log(signed)
        expect(signed.errorCode).to.equal(0)

        let submitted = yield sdk.transaction.submit({
            signature: signed.result.signatures,
            blob: blobInfo.result.transactionBlob
        })

        console.log(submitted)
        expect(submitted.errorCode).to.equal(0)

        let info = null;
        for (let i = 0; i < 10; i++) {
            console.log("Getting the transaction history (attempt " + (i + 1).toString() + ")...")
            info = yield sdk.transaction.getInfo(submitted.result.hash)
            if (info.errorCode === 0) {
                break;
            }
            sleep(2000);
        }

        expect(info.errorCode).to.equal(0)

    });

    xit('testing withdraw function', function* () {

        const nonceResult = yield sdk.account.getNonce(sourceAddress);

        expect(nonceResult.errorCode).to.equal(0)

        let nonce = nonceResult.result.nonce;
        nonce = new BigNumber(nonce).plus(1).toString(10);

        /*
         Specify the input parameters for invoking contract
         */
        let input = {
            "method": "withdraw",
            "params": {
                "value": "10"
            }
        }

        let contractInvoke = yield sdk.operation.contractInvokeByGasOperation({
            contractAddress,
            sourceAddress,
            gasAmount: '0',
            input: JSON.stringify(input),
        });

        console.log(contractInvoke)

        expect(contractInvoke.errorCode).to.equal(0)

        const operationItem = contractInvoke.result.operation;

        console.log(operationItem)

        let feeData = yield sdk.transaction.evaluateFee({
            sourceAddress,
            nonce,
            operations: [operationItem],
            signtureNumber: '100',
        });
        console.log(feeData)
        expect(feeData.errorCode).to.equal(0)

        let feeLimit = feeData.result.feeLimit;
        let gasPrice = feeData.result.gasPrice;

        console.log("gasPrice", gasPrice);
        console.log("feeLimit", feeLimit);

        const blobInfo = sdk.transaction.buildBlob({
            sourceAddress: sourceAddress,
            gasPrice: gasPrice,
            feeLimit: feeLimit,
            nonce: nonce,
            operations: [operationItem],
        });

        console.log(blobInfo);
        expect(blobInfo.errorCode).to.equal(0)

        const signed = sdk.transaction.sign({
            privateKeys: [privateKey],
            blob: blobInfo.result.transactionBlob
        })

        console.log(signed)
        expect(signed.errorCode).to.equal(0)

        let submitted = yield sdk.transaction.submit({
            signature: signed.result.signatures,
            blob: blobInfo.result.transactionBlob
        })

        console.log(submitted)
        expect(submitted.errorCode).to.equal(0)

        let info = null;
        for (let i = 0; i < 10; i++) {
            console.log("Getting the transaction history (attempt " + (i + 1).toString() + ")...")
            info = yield sdk.transaction.getInfo(submitted.result.hash)
            if (info.errorCode === 0) {
                break;
            }
            sleep(2000);
        }

        expect(info.errorCode).to.equal(0)

    });

    xit('testing transfer function', function* () {

        const nonceResult = yield sdk.account.getNonce(sourceAddress);

        expect(nonceResult.errorCode).to.equal(0)

        let nonce = nonceResult.result.nonce;
        nonce = new BigNumber(nonce).plus(1).toString(10);

        /*
         Specify the input parameters for invoking contract
         */
        let input = {
            "method": "transfer",
            "params": {
                "to": "ZTX3Ka6wZ6syn7HfAhBNid4YAK4Kvbj7nRcuR",
                "value": "30"
            }
        }

        let contractInvoke = yield sdk.operation.contractInvokeByGasOperation({
            contractAddress,
            sourceAddress,
            gasAmount: '0',
            input: JSON.stringify(input),
        });

        console.log(contractInvoke)

        expect(contractInvoke.errorCode).to.equal(0)

        const operationItem = contractInvoke.result.operation;

        console.log(operationItem)

        let feeData = yield sdk.transaction.evaluateFee({
            sourceAddress,
            nonce,
            operations: [operationItem],
            signtureNumber: '100',
        });
        console.log(feeData)
        expect(feeData.errorCode).to.equal(0)

        let feeLimit = feeData.result.feeLimit;
        let gasPrice = feeData.result.gasPrice;

        console.log("gasPrice", gasPrice);
        console.log("feeLimit", feeLimit);

        const blobInfo = sdk.transaction.buildBlob({
            sourceAddress: sourceAddress,
            gasPrice: gasPrice,
            feeLimit: feeLimit,
            nonce: nonce,
            operations: [operationItem],
        });

        console.log(blobInfo);
        expect(blobInfo.errorCode).to.equal(0)

        const signed = sdk.transaction.sign({
            privateKeys: [privateKey],
            blob: blobInfo.result.transactionBlob
        })

        console.log(signed)
        expect(signed.errorCode).to.equal(0)

        let submitted = yield sdk.transaction.submit({
            signature: signed.result.signatures,
            blob: blobInfo.result.transactionBlob
        })

        console.log(submitted)
        expect(submitted.errorCode).to.equal(0)

        let info = null;
        for (let i = 0; i < 10; i++) {
            console.log("Getting the transaction history (attempt " + (i + 1).toString() + ")...")
            info = yield sdk.transaction.getInfo(submitted.result.hash)
            if (info.errorCode === 0) {
                break;
            }
            sleep(2000);
        }

        expect(info.errorCode).to.equal(0)

    });

    xit('testing balanceOf owner function', async () => {

        let data = await sdk.contract.call({
            optType: 2,
            contractAddress: contractAddress,
            input: JSON.stringify({
                method: 'balanceOf',
                params: {
                    address: process.env.ZTX_ADDRESS
                }
            }),
        });
        console.log(data);
        console.log(data.result.query_rets);
    });

    xit('testing balanceOf pair function', async () => {

        let data = await sdk.contract.call({
            optType: 2,
            contractAddress: contractAddress,
            input: JSON.stringify({
                method: 'balanceOf',
                params: {
                    address: process.env.PAIR_ADDRESS
                }
            }),
        });
        console.log(data);
        console.log(data.result.query_rets);
    });

    xit('testing approve token function', function* () {

        const nonceResult = yield sdk.account.getNonce(sourceAddress);

        expect(nonceResult.errorCode).to.equal(0)

        let nonce = nonceResult.result.nonce;
        nonce = new BigNumber(nonce).plus(1).toString(10);

        /*
         Specify the input parameters for invoking contract
         */
        let input = {
            method: 'approve',
            params: {
                spender: process.env.ROUTER_ADDRESS,
                value: "100000000000"
            }
        }

        let contractInvoke = yield sdk.operation.contractInvokeByGasOperation({
            contractAddress,
            sourceAddress,
            gasAmount: '50',
            input: JSON.stringify(input),
        });

        console.log(contractInvoke)

        expect(contractInvoke.errorCode).to.equal(0)

        const operationItem = contractInvoke.result.operation;

        console.log(operationItem)

        let feeData = yield sdk.transaction.evaluateFee({
            sourceAddress,
            nonce,
            operations: [operationItem],
            signtureNumber: '100',
        });
        console.log(feeData)
        expect(feeData.errorCode).to.equal(0)

        let feeLimit = feeData.result.feeLimit;
        let gasPrice = feeData.result.gasPrice;

        console.log("gasPrice", gasPrice);
        console.log("feeLimit", feeLimit);

        const blobInfo = sdk.transaction.buildBlob({
            sourceAddress: sourceAddress,
            gasPrice: gasPrice,
            feeLimit: feeLimit,
            nonce: nonce,
            operations: [operationItem],
        });

        console.log(blobInfo);
        expect(blobInfo.errorCode).to.equal(0)

        const signed = sdk.transaction.sign({
            privateKeys: [privateKey],
            blob: blobInfo.result.transactionBlob
        })

        console.log(signed)
        expect(signed.errorCode).to.equal(0)

        let submitted = yield sdk.transaction.submit({
            signature: signed.result.signatures,
            blob: blobInfo.result.transactionBlob
        })

        console.log(submitted)
        expect(submitted.errorCode).to.equal(0)

        let info = null;
        for (let i = 0; i < 10; i++) {
            console.log("Getting the transaction history (attempt " + (i + 1).toString() + ")...")
            info = yield sdk.transaction.getInfo(submitted.result.hash)
            if (info.errorCode === 0) {
                break;
            }
            sleep(2000);
        }

        expect(info.errorCode).to.equal(0)

    });

    xit('testing allowance function', async () => {

        let data = await sdk.contract.call({
            optType: 2,
            contractAddress: contractAddress,
            input: JSON.stringify({
                method: 'allowance',
                params: {
                    owner: process.env.ZTX_ADDRESS,
                    spender: process.env.ROUTER_ADDRESS
                }
            }),
        });
        console.log(data);
        console.log(data.result.query_rets);
    });

    it('testing contract info function', async () => {

        let data = await sdk.contract.call({
            optType: 2,
            contractAddress: contractAddress,
            input: JSON.stringify({
                method: 'contractInfo'
            }),
        });
        console.log(data);
        console.log(data.result.query_rets);
    });
});
