const deployOperation = require("../deploy-operation");
require('dotenv').config({path: ".env"})

const privateKey = process.env.PRIVATE_KEY;
const sourceAddress = process.env.ZTX_ADDRESS;
const nodeUrl = process.env.NODE_URL;

const option = process.argv[2];

let contractName = "";
let input = {};

switch (option) {
    case 'core':
        contractName = 'specs/ztp3525/ztp3525-spec.js'
        break;
    case 'mintable':
        contractName = 'specs/ztp3525/ztp3525-mintable-spec.js'
        break;
    case 'burnable':
        contractName = 'specs/ztp3525/ztp3525-burnable-spec.js'
        break;
    case 'slotEnumerable':
        contractName = 'specs/ztp3525/ztp3525-slot-enumerable-spec.js';
        break;
    case 'slotApprovable':
        contractName = 'specs/ztp3525/ztp3525-slot-approvable-spec.js';
        break;
    default:
        console.log("Option does not exist. Please run 'npm run help' for more information.");
        process.exit(0)
}

deployOperation(nodeUrl, sourceAddress, privateKey, contractName, input);
