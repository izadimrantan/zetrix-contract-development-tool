# Zetrix Contract Development Toolkit


### ENV file creation

Create dotenv file and fill in the zetrix address, private key and node url information

```
PRIVATE_KEY=<PRIVATE_KEY>
ZTX_ADDRESS=<ZETRIX_ADDRESS>
NODE_URL=test-node.zetrix.com

// Common
SPEC_LOGIC_OP=ZTX3XoRz1AP8GLcPtfB2VCVDMB6Bv3LXJvS76
SPEC_MATH=ZTX3ZJVFuJG8FiH8Gz9fo8ZYL4fFo3CZTt8Uf
SPEC_BYTES=ZTX3P9eSyETTxGToVyEhsF6WFTaPLGTCtiH5U

// ZTP721
SPEC_ZTP721=ZTX3ce2vPWFYD3DT9ZHSPedUwqRLV4cZiRtzt
SPEC_ZTP721_ENUMERABLE=ZTX3QKh1kJWse1LA6caB6vg7VJe7vZkx5Di2G
SPEC_ZTP721_BURNABLE=ZTX3GJfJsWJMbpP56QVnEDVesAy7oHApChQAn
SPEC_ZTP721_PAUSABLE=ZTX3aPyXzTkMWkLadfqrNLGCDVk4WT4gsiBdd

// ZTP1155
SPEC_ZTP1155=ZTX3SQtXaoe251gRbxJGDqTHD5wBtLN5dFWdc
SPEC_ZTP1155_BURNABLE=ZTX3VRRFbRDga4ETf2dS7pJyDQkTUn8crACgJ
SPEC_ZTP1155_PAUSABLE=ZTX3LSsggLA87zfN5f5DPbM93fEpTWKouahZx
SPEC_ZTP1155_SUPPLY=ZTX3UbyUfPFcn7bTjPYnXeVHYSe8Xdnx7yAvL
SPEC_ZTP1155_URI=ZTX3ZP3it7ZyZekPBqhXLx4anAYJTrE13SEJ2

// ZTP20
SPEC_ZTP20=ZTX3au1XQ42bu19ESx61qC6CwQSr4hfEPqCKF
SPEC_ZTP20_PERMIT=ZTX3JBwdLZ2Sx14vbwtfQxnkaApkzNgHyc5Ae
SPEC_ZTP20_PAUSABLE=ZTX3X4e3TBhrUY8Ca7xdZP9a2UiyUuYHbn2GP
SPEC_ZTP20_BURNABLE=ZTX3Jf5gdqu74Y7p15m7pUa5L3sCwFAvbubWz
SPEC_ZTP20_CAPPED=ZTX3PG81Rme1E3pMxGSpHdjYfamggR646ixaN
```

### Install dependencies

Install all related dependencies. 

```
npm install
```

### Contract development

The contract script can be depicted in the following directory **contracts**. You can change the filename accordingly. In case of changing the filename, please modify the contract name in **scripts** directory as well.

### Run script manual
```
npm run help
```

### Contract deployment
```
npm run deploy:<NAMING_REFER_TO_PACKAGE_JSON>
```

### Contract upgrade
```
npm run upgrade:<NAMING_REFER_TO_PACKAGE_JSON>
```

### Run test
```
npm test tests/<TEST_CASE>.js
```

