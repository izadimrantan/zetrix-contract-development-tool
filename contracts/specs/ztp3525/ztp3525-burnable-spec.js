'use strict';

import 'utils/basic-operation';
import 'utils/interface';
import 'interface/IZEP165';
import 'interface/ztp3525/IZTP3525';
import 'interface/ztp721/IZTP721';
import 'interface/ztp3525/IZTP3525Receiver';
import 'interface/ztp721/IZTP721Receiver';
import 'library/ztp3525/ztp3525';
import 'library/ztp3525/ztp3525Mintable';
import 'library/ztp3525/ztp3525Burnable';

const ZTP3525Inst = new ZTP3525Burnable();

 function mint(paramObj) {
    ZTP3525Inst.p.mint(paramObj.to, paramObj.tokenId, paramObj.slot, paramObj.value);
 }

 function mintValue(paramObj) {
    ZTP3525Inst.p.mintValue(paramObj.tokenId, paramObj.value);
 }

 function burn(paramObj) {
    ZTP3525Inst.p.burn(paramObj.tokenId);
 }

 function burnValue(paramObj) {
    ZTP3525Inst.p.burnValue(paramObj.tokenId, paramObj.burnValue);
 }

function init() {
    ZTP3525Inst.p.init(
        "RWA 3525",
        "RWA3525",
        "3525 RWA Token"
    );

    Utils.assert(implementsInterface(ZTP3525Inst, IZTP721), "ZTP3525 class does not implement IZTP721");
    Utils.assert(implementsInterface(ZTP3525Inst, IZTP3525Receiver), "ZTP3525 class does not implement IZTP3525Receiver");
    Utils.assert(implementsInterface(ZTP3525Inst, IZTP721Receiver), "ZTP3525 class does not implement IZTP721Receiver");
    Utils.assert(implementsInterface(ZTP3525Inst, IZEP165), "ZTP3525 class does not implement IZEP165");
    return true;
}

function main(input_str) {
    let funcList = {
        'safeTransferFrom': ZTP3525Inst.safeTransferFrom,
        'transferFrom': ZTP3525Inst.transferFrom,
        'approve': ZTP3525Inst.approve, 
        'setApprovalForAll': ZTP3525Inst.setApprovalForAll,
        'mint': mint,
        'mintValue': mintValue,
        'burn': burn,
        'burn': burnValue
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    funcList[inputObj.method](inputObj.params);
}

function query(input_str) {
    let funcList = {
        'balanceOf': ZTP3525Inst.balanceOf,
        'ownerOf': ZTP3525Inst.ownerOf,
        'slotOf': ZTP3525Inst.slotOf,
        'allowance': ZTP3525Inst.allowance,
        'getApproved': ZTP3525Inst.getApproved,
        'isApprovedForAll': ZTP3525Inst.isApprovedForAll,
        'contractInfo': ZTP3525Inst.contractInfo,
        'contractURI': ZTP3525Inst.contractURI,
        'slotURI': ZTP3525Inst.slotURI,
        'tokenURI': ZTP3525Inst.tokenURI,
        'name': ZTP3525Inst.name,
        'symbol': ZTP3525Inst.symbol,
        'valueDecimals': ZTP3525Inst.valueDecimals,
        'totalSupply': ZTP3525Inst.totalSupply,
        'supportsInterface': ZTP3525Inst.supportsInterface 
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    return JSON.stringify(funcList[inputObj.method](inputObj.params));
}
