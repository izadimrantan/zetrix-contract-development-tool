'use strict';

import 'utils/basic-operation'
import 'utils/interface';
import 'interface/IZEP165';
import 'interface/ztp1155/IZTP1155';
import 'interface/ztp1155/IZTP1155MetadataURI';
import 'library/ztp1155/ztp1155URIStorage'

const ZTP1155Inst = new ZTP1155URIStorage();

function mint(paramObj) {
    ZTP1155Inst.p.mint(paramObj.to, paramObj.id, paramObj.value);
}

function mintBatch(paramObj) {
    ZTP1155Inst.p.mint(paramObj.to, paramObj.ids, paramObj.values);
}

function burn(paramObj) {
    ZTP1155Inst.p.burn(paramObj.to, paramObj.id, paramObj.value);
}

function burnBatch(paramObj) {
    ZTP1155Inst.p.burnBatch(paramObj.to, paramObj.ids, paramObj.values);
}

function setUri(paramObj) {
    Utils.assert(paramObj.tokenId !== null && paramObj.tokenId.length > 0, 'Wrong token id');
    Utils.assert(paramObj.tokenURI !== null && paramObj.tokenURI.length > 0, 'Wrong token url');
    ZTP1155Inst.setUri(paramObj.tokenId, paramObj.tokenURI);
}

function setBaseURI(paramObj) {
    Utils.assert(paramObj.baseURI !== null && paramObj.baseURI.length > 0, 'Wrong base url');
    ZTP1155Inst.setBaseURI(paramObj.baseURI);
}

function init() {

    ZTP1155Inst.p.init('https://example.com/');

    Utils.assert(implementsInterface(ZTP1155Inst, IZTP1155), "ZTP1155 class does not implement IZTP1155");
    Utils.assert(implementsInterface(ZTP1155Inst, IZTP1155MetadataURI), "ZTP1155 class does not implement IZTP1155MetadataURI");
    Utils.assert(implementsInterface(ZTP1155Inst, IZEP165), "ZTP1155 class does not implement IZEP165");
    return true;
}

function main(input_str) {
    let funcList = {
        'setApprovalForAll': ZTP1155Inst.setApprovalForAll,
        'safeTransferFrom': ZTP1155Inst.safeTransferFrom,
        'safeBatchTransferFrom': ZTP1155Inst.safeBatchTransferFrom,
        'mint': mint,
        'mintBatch': mintBatch,
        'burn': burn,
        'burnBatch': burnBatch,
        'setUri': setUri,
        'setBaseURI': setBaseURI
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    funcList[inputObj.method](inputObj.params);
}

function query(input_str) {
    let funcList = {
        'balanceOf': ZTP1155Inst.balanceOf,
        'balanceOfBatch': ZTP1155Inst.balanceOfBatch,
        'isApprovedForAll': ZTP1155Inst.isApprovedForAll,
        'contractInfo': ZTP1155Inst.contractInfo,
        'supportsInterface': ZTP1155Inst.supportsInterface
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    return JSON.stringify(funcList[inputObj.method](inputObj.params));
}
