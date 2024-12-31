# Uniswap Zetrix


### ENV file creation

Create dotenv file and fill in the zetrix address, private key and node url information

```
PRIVATE_KEY=<TX_INITIATOR_PRIV_KEY>
ZTX_ADDRESS=<TX_INITIATOR_ADDRESS>
NODE_URL=test-node.zetrix.com
MATH_LIB_SPEC=ZTX3GwGxP8R9GLHVEBmmJ39Mdp98NjLZuMFe7
WZTX=ZTX3H4XbJ27HqBBquAkeCe5VQTWoKYF6JswKT
UNISWAP_V2_ZTP20_SPEC=ZTX3dUMfLyXUenv1D24YFMher9VBVVbicjwcL
UNISWAP_V2_LIBRARY=ZTX3VCy5CjwebgvFLBE9FFY4PETmmyTwbKt8d
PAIR_ADDRESS=ZTX3aaQ8Lf8WS3Wpr6UgxeYdwJ4qsmY2999VH
FACTORY_ADDRESS=ZTX3Fb6f9SgCmryoFPU56GAYLBsXkQVaz9NLJ
ROUTER_ADDRESS=ZTX3ZXEUTEPme3x2gCuEAWdatU6dzvs4uEL96
TOKEN_DAI_ADDRESS=ZTX3cyH562MvVvPNS2zWt7KZnWDGNhiucnoQg
TOKEN_PEPE_ADDRESS=ZTX3XsWnusd2mE7BxzLprmFYzt7XQenFPurKh
TOKEN_USDC_ADDRESS=ZTX3FbX1oMVj9P8mFp3nNkMfcf7xUrZ8uyW1d
TOKEN_SHIBA_ADDRESS=ZTX3cr9xtUJg7irFtbCPiEzgGq5SPvo2gYw1D
```

### Install dependencies

Install all related dependencies. 

```
npm install

```

In case of having error during installation, please check the node version. Current validated node / npm version is as follows (in linux pc, windows might use different version):

```
node = v16.14.0
npm = 8.3.1

```


### Contract development

The contract script can be depicted in the following directory **contracts/base.js**. You can change the filename accordingly. In case of changing the filename, please modify the contract name in **scripts/01_deploy.js** as well.


### Contract deployment

1. Deploy Factory and set the factory address
2. Deploy WZTX token
3. Deploy other token (DAI, PEPE, etc)
4. Deploy Router02 (set Factory and WZTX address in init)

```
npm run deploy:<NAMING_REFER_TO_PACKAGE_JSON>
```


### Run test

1. Set approve to router02 for each token (test-ztp20-dai, test-ztp20-pepe)
2. Add liquidity to create token pair (test-uniswap-v2-router02)
3. Test swap (test-uniswap-v2-router02)

```
npm test tests/<TEST_CASE>.js
```

