/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155Supply.sol
 */

import 'utils/basic-operation'
import 'library/ztp1155/ztp1155';

const ZTP1155Supply = function () {

    const BasicOperationUtil = new BasicOperation();

    const TOTAL_SUPPLY_PRE = 'total_supply';
    const TOTAL_SUPPLY_ALL = 'total_supply_all';

    const self = this;

    ZTP1155.call(self);

    self.totalSupply = function (paramObj) {
        if (paramObj.id === null || paramObj.id.length === 0) {
            return BasicOperationUtil.loadObj(TOTAL_SUPPLY_ALL);
        }
        return BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, paramObj.id));
    };

    self.exist = function (paramObj) {
        let supply = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, paramObj.id));
        return supply !== false;
    };

    // override
    const _update = self.p.update;
    self.p.update = function (from, to, ids, values) {
        _update.call(self, from, to, ids, values);

        if (Utils.addressCheck(from)) {
            let totalMintValue = '0';
            let i;
            for (i = 0; i < ids.length; i += 1) {
                let valueFrom = values[i];
                let totalSupplyFrom = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, ids[i]));
                totalSupplyFrom = Utils.int256Add(totalSupplyFrom, valueFrom);
                BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, ids[i]), totalSupplyFrom);
                totalMintValue = Utils.int256Add(totalMintValue, valueFrom);
            }
            let totalSupplyAllFrom = BasicOperationUtil.loadObj(TOTAL_SUPPLY_ALL);
            totalSupplyAllFrom = Utils.int256Add(totalSupplyAllFrom, totalMintValue);
            BasicOperationUtil.saveObj(TOTAL_SUPPLY_ALL, totalSupplyAllFrom);
        }

        if (Utils.addressCheck(to)) {
            let totalBurnValue = '0';
            let j;
            for (j = 0; j < ids.length; j += 1) {
                let valueTo = values[j];
                let totalSupplyTo = BasicOperationUtil.loadObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, ids[j]));
                totalSupplyTo = Utils.int256Sub(totalSupplyTo, valueTo);
                BasicOperationUtil.saveObj(BasicOperationUtil.getKey(TOTAL_SUPPLY_PRE, ids[j]), totalSupplyTo);
                totalBurnValue = Utils.int256Add(totalBurnValue, valueTo);
            }
            let totalSupplyAllTo = BasicOperationUtil.loadObj(TOTAL_SUPPLY_ALL);
            totalSupplyAllTo = Utils.int256Sub(totalSupplyAllTo, totalBurnValue);
            BasicOperationUtil.saveObj(TOTAL_SUPPLY_ALL, totalSupplyAllTo);
        }
    };

};
