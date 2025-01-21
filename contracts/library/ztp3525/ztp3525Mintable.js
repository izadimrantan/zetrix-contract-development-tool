/**
 * SPDX-License-Identifier: MIT
 * Reference : https://github.com/solv-finance/erc-3525/blob/main/contracts/ERC3525Mintable.sol
 */

import 'library/ztp3525/ztp3525';

const ZTP3525Mintable = function () {

    const self = this;

    ZTP3525.call(self);

    // override
    const _mint = self.p.mint;
    self.p.mint = function (mintTo, tokenId, slot, value) {
        _mint.call(self, mintTo, slot, value, tokenId);
    };

    // override
    const _mintValue = self.p.mintValue;
    self.p.mintValue = function (tokenId, value) {
        _mintValue.call(self, tokenId, value);
    };
};
