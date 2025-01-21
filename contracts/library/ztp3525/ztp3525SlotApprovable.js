/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol
 */

import 'utils/basic-operation';
import 'library/ztp3525/ztp3525';
import 'library/ztp3525/ztp3525SlotEnumerable';
import 'interface/ztp3525/IZTP3525SlotApprovable';

const ZTP3525SlotApprovable = function () {
    const SLOT_APPROVALS = 'slot_approvals';
    const BasicOperationUtil = new BasicOperation();
    const self = this;

    ZTP3525SlotEnumerable.call(self);

    function SlotApproval() {
        this.operator = [];
    }

    const _supportsInterface = self.supportsInterface;
    self.supportsInterface = function (paramObj) {
        let interfaceId = paramObj.interfaceId;
        let iface = Utils.sha256(JSON.stringify(IZTPSlotApprovable), 1);
        return interfaceId === iface || _supportsInterface.call(self, paramObj);
    };

    self.setApprovalForSlot = function (paramObj) {
        Utils.assert(Chain.msg.sender === paramObj.owner || self.isApprovedForAll(paramObj.owner, Chain.msg.sender), 'ZTP3525SlotApprovable: Caller is not owner nor approved for all.');
        self.p.setApprovalForSlot(paramObj.owner, paramObj.slot, paramObj.operator, paramObj.approved);
    };  

    self.p.setApprovalForSlot = function (owner, slot, operator, approved) {
        Utils.assert(owner !== operator, 'ZTP3525SlotApprovable: Approve to owner.');
        if (approved) {
            let slotApproval = new SlotApproval();
            slotApproval.operator.push(operator);
            BasicOperationUtil.saveObj(BasicOperationUtil.getKey(SLOT_APPROVALS, owner, slot), slotApproval);
        } else {
            let slotApproval = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(SLOT_APPROVALS, owner, slot));
            slotApproval.operator = slotApproval.operator.filter(function(approvedOperator) {
                return approvedOperator !== operator;
            });
            BasicOperationUtil.saveObj(BasicOperationUtil.getKey(SLOT_APPROVALS, owner, slot), slotApproval);
        }
    };  

    self.isApprovedForSlot = function (paramObj) {
        let slotApproval = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(SLOT_APPROVALS, paramObj.owner, paramObj.slot));
        return slotApproval.operator.includes(paramObj.operator);
    };

    self.approve = function (to, tokenId) {
        let owner = self.ownerOf(tokenId);
        let slot = self.slotOf(tokenId);

        Utils.assert(to !== owner, 'ZTP3525: Approval to current owner.');
        Utils.assert(Chain.msg.sender === owner || 
            self.isApprovedForAll(owner, Chain.msg.sender) || 
            self.isApprovedForSlot({ owner: owner, slot: slot, operator: Chain.msg.sender }), 
            'ZTP3525: Approve caller is not owner nor approved.'
        );

        self.p.approve(to, tokenId);
    };

    const _isApprovedOrOwner = function (operator, tokenId) {
        self.p.requireMinted(tokenId);
        let owner = self.ownerOf(tokenId);
        let slot = self.slotOf(tokenId);

        return operator === owner || 
            self.getApproved(tokenId) === operator || 
            self.isApprovedForAll(owner, operator) || 
            self.isApprovedForSlot({ owner: owner, slot: slot, operator: operator });
    };
};
