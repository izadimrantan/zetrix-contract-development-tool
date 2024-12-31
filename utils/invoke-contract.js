const BigNumber = require('bignumber.js');
const expect = require('chai').expect;
const sleep = require("../utils/delay");

async function invokeContract(sdk, sourceAddress, privateKey, contractAddress, input) {
    const nonceResult = await sdk.account.getNonce(sourceAddress);

    expect(nonceResult.errorCode).to.equal(0)

    let nonce = nonceResult.result.nonce;
    nonce = new BigNumber(nonce).plus(1).toString(10);

    let contractInvoke = await sdk.operation.contractInvokeByGasOperation({
        contractAddress,
        sourceAddress,
        gasAmount: '50',
        input: JSON.stringify(input),
    });

    expect(contractInvoke.errorCode).to.equal(0)

    const operationItem = contractInvoke.result.operation;

    let feeData = await sdk.transaction.evaluateFee({
        sourceAddress,
        nonce,
        operations: [operationItem],
        signtureNumber: '100',
    });

    console.log(feeData)

    expect(feeData.errorCode).to.equal(0)

    let feeLimit = feeData.result.feeLimit;
    let gasPrice = feeData.result.gasPrice;

    const blobInfo = sdk.transaction.buildBlob({
        sourceAddress: sourceAddress,
        gasPrice: gasPrice,
        feeLimit: feeLimit,
        nonce: nonce,
        operations: [operationItem],
    });

    expect(blobInfo.errorCode).to.equal(0)

    const signed = sdk.transaction.sign({
        privateKeys: [privateKey],
        blob: blobInfo.result.transactionBlob
    })

    expect(signed.errorCode).to.equal(0)

    let submitted = await sdk.transaction.submit({
        signature: signed.result.signatures,
        blob: blobInfo.result.transactionBlob
    })

    expect(submitted.errorCode).to.equal(0)

    let info = null;
    for (let i = 0; i < 10; i++) {
        console.log("Getting the transaction history (attempt " + (i + 1).toString() + ")...")
        info = await sdk.transaction.getInfo(submitted.result.hash)
        if (info.errorCode === 0) {
            break;
        }
        sleep(2000);
    }

    expect(info.errorCode).to.equal(0)

    return info;
}

module.exports = invokeContract;
