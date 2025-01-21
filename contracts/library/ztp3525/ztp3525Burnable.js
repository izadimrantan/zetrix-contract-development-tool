/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/extensions/ERC1155Burnable.sol
 */

import 'library/ztp3525/ztp3525';
import 'library/ztp3525/ztp3525Mintable';

const ZTP3525Burnable = function () {

    const self = this;

    ZTP3525.call(self);
    ZTP3525Mintable.call(self);

    // override
    const _burn = self.p.burn;
    self.p.burn = function (tokenId) {
        Utils.assert(self.p.isApprovedOrOwner(Chain.msg.sender, tokenId) === true, 'ZTP3525: Caller is not token owner nor approved.');
        _burn.call(self, tokenId);
    };

    // override
    const _burnValue = self.p.burnValue;
    self.p.burnValue = function (tokenId, burnValue) {
        Utils.assert(self.p.isApprovedOrOwner(Chain.msg.sender, tokenId) === true, 'ZTP3525: Caller is not token owner nor approved.');
        _burnValue.call(self, tokenId, burnValue);
    };
};
