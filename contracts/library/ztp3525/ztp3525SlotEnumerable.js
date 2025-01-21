/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol
 */

import 'utils/basic-operation';
import 'library/ztp3525/ztp3525';
import 'interface/ztp3525/IZTP3525SlotEnumerable';

const ZTP3525SlotEnumerable = function () {
    const ALL_SLOTS = 'all_slots';
    const SLOT_PRE = 'slot';
    const TOKEN_PRE = 'token';
    const EMPTY_ADDRESS = '0x';

    const BasicOperationUtil = new BasicOperation();
    const self = this;
    ZTP3525.call(self);

    function SlotData(slotId) {
        this.slot = slotId;
        this.slotTokens = [];
    }

    function AllSlots() {
        this.slots = [];
    }

    let allSlots = new AllSlots();
    BasicOperationUtil.saveObj(ALL_SLOTS, allSlots);

    const _supportsInterface = self.supportsInterface;
    self.supportsInterface = function (paramObj) {
        let interfaceId = paramObj.interfaceId;
        let iface = Utils.sha256(JSON.stringify(IZTP3525Enumerable), 1);
        return interfaceId === iface || _supportsInterface.call(self, paramObj);
    };

    self.slotCount = function () {
        let allSlots = BasicOperationUtil.loadObj(ALL_SLOTS);
        return allSlots.slots.length;
    };

    self.slotByIndex = function (paramObj) {
        Utils.assert(Utils.int256Compare(self.slotCount(), paramObj.index) > 0, 'ZTP3525SlotEnumerable: Slot index out of bounds.');
        let allSlots = BasicOperationUtil.loadObj(ALL_SLOTS);
        let slotData = BasicOperationUtil.loadObj(allSlots.slots[paramObj.index]);
        return slotData;
    };

    const _slotExists = function (slot) {
        let allSlots = BasicOperationUtil.loadObj(ALL_SLOTS);
        let slotKey = BasicOperationUtil.getKey(SLOT_PRE, slot);
        return allSlots.length !== 0 && allSlots.slots.includes(slotKey);
    };

    self.tokenSupplyInSlot = function (paramObj) {
        if (!_slotExists(paramObj.slot)) {
            return '0';
        }
        let slotData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(SLOT_PRE, paramObj.slot));
        return slotData.slotTokens.length;
    };

    self.tokenInSlotByIndex = function (paramObj) {
        Utils.assert(Utils.int256Compare(self.tokenSupplyInSlot(paramObj.slot), paramObj.index) > 0, 'ZTP3525SlotEnumerable: Slot token index out of bounds.');
        let allSlots = BasicOperationUtil.loadObj(ALL_SLOTS);
        let slotData = BasicOperationUtil.loadObj(allSlots.slots[paramObj.index]);
        return slotData.slotTokens;
    };

    self.p.tokenExistsInSlot = function (slot, tokenId) {
        let slotData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(SLOT_PRE, slot));
        let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        return slotData.slotTokens.length > 0 && slotData.slotTokens.includes(tokenKey);
    };

    self.p.createSlot = function (slot) {
        Utils.assert(_slotExists(slot) === false, 'ZTP3525SlotEnumerable: Slot already exists.');
        let slotData = new SlotData(slot);
        let slotKey = BasicOperationUtil.getKey(SLOT_PRE, slot);
        self.p.addSlotToAllSlotsEnumeration(slotKey);
    };

    self.p.addSlotToAllSlotsEnumeration = function (slotKey) {
        let allSlots = BasicOperationUtil.loadObj(ALL_SLOTS);
        allSlots.slots.push(slotKey);
        BasicOperationUtil.saveObj(ALL_SLOTS, allSlots);
    };

    self.p.addTokenToSlotEnumeration = function (slot, tokenId) {
        let slotData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(SLOT_PRE, slot));
        let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        slotData.slotTokens.push(tokenKey);
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(SLOT_PRE, slot), slotData);
    };

    self.p.removeTokenFromSlotEnumeration = function (slot, tokenId) {
        let slotData = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(SLOT_PRE, slot));
        let tokenKey = BasicOperationUtil.getKey(TOKEN_PRE, tokenId);
        slotData.slotTokens = slotData.slotTokens.filter(function(slotTokenKey) {
            return slotTokenKey !== tokenKey;
        });
        BasicOperationUtil.saveObj(BasicOperationUtil.getKey(SLOT_PRE, slot), slotData);
    };

    const _beforeValueTransfer = self.p.beforeValueTransfer;
    self.p.beforeValueTransfer = function (from, to, fromTokenId, toTokenId, slot, value) {
        _beforeValueTransfer.call(self, from, to, fromTokenId, toTokenId, slot, value);
        if (from === EMPTY_ADDRESS && fromTokenId === 0 && _slotExists(slot) === false) {
            self.p.createSlot(slot);
        }
    };

    const _afterValueTransfer = self.p.afterValueTransfer;
    self.p.afterValueTransfer = function (from, to, fromTokenId, toTokenId, slot, value) {
        if (from === EMPTY_ADDRESS && fromTokenId === 0 && self.p.tokenExistsInSlot(slot, toTokenId) === false) {
            self.p.addTokenToSlotEnumeration(slot, toTokenId);
        } else if (to === EMPTY_ADDRESS && toTokenId === 0 && self.p.tokenExistsInSlot(slot, fromTokenId) === true) {
            self.p.removeTokenFromSlotEnumeration(slot, fromTokenId);
        }
        _afterValueTransfer.call(self, from, to, fromTokenId, toTokenId, slot, value);
    };
};
