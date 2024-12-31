async function queryContract(sdk, contractAddress, input) {
    let resp = await sdk.contract.call({
        optType: 2,
        contractAddress: contractAddress,
        input: JSON.stringify(input),
    });

    if (resp.result.query_rets[0].error != null) {
        console.log(resp.result.query_rets[0].error.data);
        return null;
    }

    return JSON.parse(resp.result.query_rets[0].result.value);
}

module.exports = queryContract;
